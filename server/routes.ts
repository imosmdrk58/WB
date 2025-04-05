import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startBot } from "./discord";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";
import { z } from "zod";
import { insertUserSchema, User } from "@shared/schema";
import { config } from "./config";

interface SessionUser {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean | null;
}

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 86400000 },
      store: new MemoryStoreSession({
        checkPeriod: 86400000
      })
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Kullanıcı adı veya şifre hatalı.' });
        }
        
        if (user.password !== password) {
          return done(null, false, { message: 'Kullanıcı adı veya şifre hatalı.' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Oturum açmanız gerekiyor.' });
  };
  
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user?.isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'Bu işlem için yetkiniz yok.' });
  };
  
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });
  });
  
  app.post('/api/logout', (req, res) => {
    req.logout(err => {
      if (err) {
        return res.status(500).json({ message: 'Çıkış yapılırken bir hata oluştu.' });
      }
      res.json({ message: 'Başarıyla çıkış yapıldı.' });
    });
  });
  
  app.get('/api/session', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isLoggedIn: true, user: req.user });
    } else {
      res.json({ isLoggedIn: false });
    }
  });
  
  app.post('/api/register', async (req, res) => {
    try {
      const validationResult = insertUserSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Geçersiz kullanıcı verileri.', 
          errors: validationResult.error.format() 
        });
      }
      
      const { username, password } = validationResult.data;
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor.' });
      }
      
      const newUser = await storage.createUser({ username, password });
      
      res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu.', user: newUser });
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      res.status(500).json({ message: 'Kullanıcı oluşturulurken bir hata oluştu.' });
    }
  });
  
  app.get('/api/servers', isAuthenticated, async (req, res) => {
    try {
      const servers = await storage.getAllServers();
      res.json(servers);
    } catch (error) {
      console.error('Sunucu listesi hatası:', error);
      res.status(500).json({ message: 'Sunucu listesi alınırken bir hata oluştu.' });
    }
  });
  
  app.get('/api/servers/:id', isAuthenticated, async (req, res) => {
    try {
      const server = await storage.getServer(req.params.id);
      
      if (!server) {
        return res.status(404).json({ message: 'Sunucu bulunamadı.' });
      }
      
      res.json(server);
    } catch (error) {
      console.error('Sunucu detay hatası:', error);
      res.status(500).json({ message: 'Sunucu bilgileri alınırken bir hata oluştu.' });
    }
  });
  
  app.patch('/api/servers/:id', isAuthenticated, async (req, res) => {
    try {
      const serverId = req.params.id;
      
      const server = await storage.getServer(serverId);
      if (!server) {
        return res.status(404).json({ message: 'Sunucu bulunamadı.' });
      }
      
      const updateSchema = z.object({
        name: z.string().optional(),
        prefix: z.string().optional(),
        logChannelId: z.string().nullable().optional(),
        welcomeChannelId: z.string().nullable().optional(),
        welcomeMessage: z.string().nullable().optional(),
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Geçersiz sunucu verileri.', 
          errors: validationResult.error.format() 
        });
      }
      
      const updatedServer = await storage.updateServer(serverId, validationResult.data);
      
      res.json(updatedServer);
    } catch (error) {
      console.error('Sunucu güncelleme hatası:', error);
      res.status(500).json({ message: 'Sunucu güncellenirken bir hata oluştu.' });
    }
  });
  
  app.get('/api/servers/:id/guard', isAuthenticated, async (req, res) => {
    try {
      const guardSettings = await storage.getGuardSettings(req.params.id);
      
      if (!guardSettings) {
        return res.status(404).json({ message: 'Guard ayarları bulunamadı.' });
      }
      
      res.json(guardSettings);
    } catch (error) {
      console.error('Guard ayarları hatası:', error);
      res.status(500).json({ message: 'Guard ayarları alınırken bir hata oluştu.' });
    }
  });
  
  app.patch('/api/servers/:id/guard', isAuthenticated, async (req, res) => {
    try {
      const serverId = req.params.id;
      
      const guardSettings = await storage.getGuardSettings(serverId);
      if (!guardSettings) {
        return res.status(404).json({ message: 'Guard ayarları bulunamadı.' });
      }
      
      const updateSchema = z.object({
        antiSpam: z.boolean().optional(),
        antiRaid: z.boolean().optional(),
        antiLink: z.boolean().optional(),
        captcha: z.boolean().optional(),
        maxWarnings: z.number().optional(),
        muteTime: z.number().optional(),
        settings: z.record(z.any()).optional(),
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: 'Geçersiz guard verileri.', 
          errors: validationResult.error.format() 
        });
      }
      
      const updatedGuardSettings = await storage.updateGuardSettings(serverId, validationResult.data);
      
      res.json(updatedGuardSettings);
    } catch (error) {
      console.error('Guard ayarları güncelleme hatası:', error);
      res.status(500).json({ message: 'Guard ayarları güncellenirken bir hata oluştu.' });
    }
  });
  
  app.get('/api/servers/:id/activity', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getActivityLogs(req.params.id, limit);
      
      res.json(logs);
    } catch (error) {
      console.error('Aktivite logları hatası:', error);
      res.status(500).json({ message: 'Aktivite logları alınırken bir hata oluştu.' });
    }
  });
  
  app.get('/api/servers/:id/guard-events', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await storage.getGuardEvents(req.params.id, limit);
      
      res.json(events);
    } catch (error) {
      console.error('Guard olayları hatası:', error);
      res.status(500).json({ message: 'Guard olayları alınırken bir hata oluştu.' });
    }
  });
  
  app.get('/api/commands', async (req, res) => {
    try {
      const commands = await storage.getAllCommands();
      res.json(commands);
    } catch (error) {
      console.error('Komut listesi hatası:', error);
      res.status(500).json({ message: 'Komut listesi alınırken bir hata oluştu.' });
    }
  });
  
  app.get('/api/commands/category/:category', async (req, res) => {
    try {
      const commands = await storage.getCommandsByCategory(req.params.category);
      res.json(commands);
    } catch (error) {
      console.error('Kategori komutları hatası:', error);
      res.status(500).json({ message: 'Kategori komutları alınırken bir hata oluştu.' });
    }
  });
  
  const httpServer = createServer(app);
  
  startBot().catch(error => {
    console.error('Discord bot başlatma hatası:', error);
  });
  
  return httpServer;
}
