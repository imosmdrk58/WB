import { 
  users, type User, type InsertUser,
  servers, type Server, type InsertServer,
  guardSettings, type GuardSetting, type InsertGuardSetting,
  commands, type Command, type InsertCommand,
  activityLogs, type ActivityLog, type InsertActivityLog,
  guardEvents, type GuardEvent, type InsertGuardEvent
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getServer(id: string): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: string, server: Partial<InsertServer>): Promise<Server | undefined>;
  getAllServers(): Promise<Server[]>;
  
  getGuardSettings(serverId: string): Promise<GuardSetting | undefined>;
  createGuardSettings(settings: InsertGuardSetting): Promise<GuardSetting>;
  updateGuardSettings(serverId: string, settings: Partial<InsertGuardSetting>): Promise<GuardSetting | undefined>;
  
  getCommand(id: number): Promise<Command | undefined>;
  getCommandByName(name: string): Promise<Command | undefined>;
  createCommand(command: InsertCommand): Promise<Command>;
  updateCommand(id: number, command: Partial<InsertCommand>): Promise<Command | undefined>;
  getCommandsByCategory(category: string): Promise<Command[]>;
  getAllCommands(): Promise<Command[]>;
  
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(serverId: string, limit?: number): Promise<ActivityLog[]>;
  
  createGuardEvent(event: InsertGuardEvent): Promise<GuardEvent>;
  getGuardEvents(serverId: string, limit?: number): Promise<GuardEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private servers: Map<string, Server>;
  private guardSettings: Map<string, GuardSetting>;
  private commands: Map<number, Command>;
  private activityLogs: ActivityLog[];
  private guardEvents: GuardEvent[];

  private userId: number;
  private commandId: number;
  private guardSettingId: number;
  private activityLogId: number;
  private guardEventId: number;

  constructor() {
    this.users = new Map();
    this.servers = new Map();
    this.guardSettings = new Map();
    this.commands = new Map();
    this.activityLogs = [];
    this.guardEvents = [];
    
    this.userId = 1;
    this.commandId = 1;
    this.guardSettingId = 1;
    this.activityLogId = 1;
    this.guardEventId = 1;
    
    this.seedInitialData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  async getServer(id: string): Promise<Server | undefined> {
    return this.servers.get(id);
  }

  async createServer(server: InsertServer): Promise<Server> {
    const newServer: Server = {
      ...server,
      logChannelId: null,
      welcomeChannelId: null,
      welcomeMessage: null
    };
    
    this.servers.set(server.id || crypto.randomUUID(), newServer);
    return newServer;
  }

  async updateServer(id: string, serverUpdate: Partial<InsertServer>): Promise<Server | undefined> {
    const server = this.servers.get(id);
    if (!server) return undefined;
    
    const updatedServer: Server = {
      ...server,
      ...serverUpdate
    };
    
    this.servers.set(id, updatedServer);
    return updatedServer;
  }

  async getAllServers(): Promise<Server[]> {
    return Array.from(this.servers.values());
  }

  async getGuardSettings(serverId: string): Promise<GuardSetting | undefined> {
    return this.guardSettings.get(serverId);
  }

  async createGuardSettings(settings: InsertGuardSetting): Promise<GuardSetting> {
    const id = this.guardSettingId++;
    const guardSetting: GuardSetting = { ...settings, id };
    this.guardSettings.set(settings.serverId, guardSetting);
    return guardSetting;
  }

  async updateGuardSettings(serverId: string, settingsUpdate: Partial<InsertGuardSetting>): Promise<GuardSetting | undefined> {
    const settings = this.guardSettings.get(serverId);
    if (!settings) return undefined;
    
    const updatedSettings: GuardSetting = {
      ...settings,
      ...settingsUpdate
    };
    
    this.guardSettings.set(serverId, updatedSettings);
    return updatedSettings;
  }

  async getCommand(id: number): Promise<Command | undefined> {
    return this.commands.get(id);
  }

  async getCommandByName(name: string): Promise<Command | undefined> {
    for (const command of this.commands.values()) {
      if (command.name === name) {
        return command;
      }
    }
    return undefined;
  }

  async createCommand(command: InsertCommand): Promise<Command> {
    const id = this.commandId++;
    const newCommand: Command = { ...command, id };
    this.commands.set(id, newCommand);
    return newCommand;
  }

  async updateCommand(id: number, commandUpdate: Partial<InsertCommand>): Promise<Command | undefined> {
    const command = this.commands.get(id);
    if (!command) return undefined;
    
    const updatedCommand: Command = {
      ...command,
      ...commandUpdate
    };
    
    this.commands.set(id, updatedCommand);
    return updatedCommand;
  }

  async getCommandsByCategory(category: string): Promise<Command[]> {
    const result: Command[] = [];
    for (const command of this.commands.values()) {
      if (command.category === category) {
        result.push(command);
      }
    }
    return result;
  }

  async getAllCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogId++;
    const timestamp = new Date();
    
    const activityLog: ActivityLog = { 
      ...log, 
      id,
      timestamp
    };
    
    this.activityLogs.push(activityLog);
    return activityLog;
  }

  async getActivityLogs(serverId: string, limit: number = 100): Promise<ActivityLog[]> {
    return this.activityLogs
      .filter(log => log.serverId === serverId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createGuardEvent(event: InsertGuardEvent): Promise<GuardEvent> {
    const id = this.guardEventId++;
    const timestamp = new Date();
    
    const guardEvent: GuardEvent = { 
      ...event, 
      id,
      timestamp
    };
    
    this.guardEvents.push(guardEvent);
    return guardEvent;
  }

  async getGuardEvents(serverId: string, limit: number = 100): Promise<GuardEvent[]> {
    return this.guardEvents
      .filter(event => event.serverId === serverId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private async seedInitialData() {
    const admin = await this.createUser({
      username: "admin",
      password: "admin123"
    });
    
    this.users.set(admin.id, { ...admin, isAdmin: true });
    
    await this.createCommand({
      name: "ban",
      description: "Kullanıcıyı sunucudan yasaklar",
      category: "moderation",
      usage: "/ban @kullanıcı [sebep]"
    });
    
    await this.createCommand({
      name: "kick",
      description: "Kullanıcıyı sunucudan atar",
      category: "moderation",
      usage: "/kick @kullanıcı [sebep]"
    });
    
    await this.createCommand({
      name: "clear",
      description: "Belirli sayıda mesajı siler",
      category: "moderation",
      usage: "/clear [sayı]"
    });
    
    await this.createCommand({
      name: "anti-spam",
      description: "Spam korumasını yapılandırır",
      category: "guard",
      usage: "/anti-spam [seviye]"
    });
    
    await this.createCommand({
      name: "anti-raid",
      description: "Raid korumasını yapılandırır",
      category: "guard",
      usage: "/anti-raid [seviye]"
    });
  }
}

export const storage = new MemStorage();