import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const servers = pgTable("servers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  prefix: text("prefix").default("!"),
  logChannelId: text("log_channel_id"),
  welcomeChannelId: text("welcome_channel_id"),
  welcomeMessage: text("welcome_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const guardSettings = pgTable("guard_settings", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().references(() => servers.id),
  antiSpam: boolean("anti_spam").default(false),
  antiRaid: boolean("anti_raid").default(false),
  antiLink: boolean("anti_link").default(false),
  captcha: boolean("captcha").default(false),
  maxWarnings: integer("max_warnings").default(3),
  muteTime: integer("mute_time").default(300),
  settings: json("settings").default({}),
});

export const commands = pgTable("commands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  usage: text("usage").notNull(),
  enabled: boolean("enabled").default(true),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().references(() => servers.id),
  userId: text("user_id"),
  username: text("username"),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const guardEvents = pgTable("guard_events", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().references(() => servers.id),
  userId: text("user_id"),
  username: text("username"),
  eventType: text("event_type").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, isAdmin: true });

export const insertServerSchema = createInsertSchema(servers)
  .omit({ id: true, createdAt: true });

export const insertGuardSettingsSchema = createInsertSchema(guardSettings)
  .omit({ id: true });

export const insertCommandSchema = createInsertSchema(commands)
  .omit({ id: true });

export const insertActivityLogSchema = createInsertSchema(activityLogs)
  .omit({ id: true, timestamp: true });

export const insertGuardEventSchema = createInsertSchema(guardEvents)
  .omit({ id: true, timestamp: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Server = typeof servers.$inferSelect;
export type InsertServer = z.infer<typeof insertServerSchema>;

export type GuardSetting = typeof guardSettings.$inferSelect;
export type InsertGuardSetting = z.infer<typeof insertGuardSettingsSchema>;

export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type GuardEvent = typeof guardEvents.$inferSelect;
export type InsertGuardEvent = z.infer<typeof insertGuardEventSchema>;
