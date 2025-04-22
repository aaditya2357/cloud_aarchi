import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define VM instance status types
export const VmStatusEnum = z.enum(['running', 'stopped', 'pending', 'error']);
export type VmStatus = z.infer<typeof VmStatusEnum>;

// Define cloud provider types
export const CloudProviderEnum = z.enum(['aws', 'gcp', 'openstack']);
export type CloudProvider = z.infer<typeof CloudProviderEnum>;

// VM Instance schema
export const instances = pgTable("instances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  instanceId: text("instance_id").notNull(),
  status: text("status").$type<VmStatus>().notNull(),
  provider: text("provider").$type<CloudProvider>().notNull(),
  ipAddress: text("ip_address"),
  cpu: integer("cpu").notNull(),
  memory: integer("memory").notNull(), // memory in GB
  cpuUsage: integer("cpu_usage").default(0), // percentage
  memoryUsage: integer("memory_usage").default(0), // percentage
  uptime: integer("uptime").default(0), // seconds
  createdAt: timestamp("created_at").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  metadata: json("metadata").$type<Record<string, any>>().default({}),
});

// Define insert schema
export const insertInstanceSchema = createInsertSchema(instances).pick({
  name: true,
  instanceId: true,
  status: true,
  provider: true,
  ipAddress: true,
  cpu: true,
  memory: true,
  cpuUsage: true,
  memoryUsage: true,
  uptime: true,
  metadata: true,
});

// Resource usage data schema
export const resourceUsage = pgTable("resource_usage", {
  id: serial("id").primaryKey(),
  instanceId: integer("instance_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  cpuUsage: integer("cpu_usage").notNull(), // percentage
  memoryUsage: integer("memory_usage").notNull(), // percentage
});

export const insertResourceUsageSchema = createInsertSchema(resourceUsage).pick({
  instanceId: true,
  cpuUsage: true, 
  memoryUsage: true,
});

// Define types for export
export type Instance = typeof instances.$inferSelect;
export type InsertInstance = z.infer<typeof insertInstanceSchema>;
export type ResourceUsage = typeof resourceUsage.$inferSelect;
export type InsertResourceUsage = z.infer<typeof insertResourceUsageSchema>;

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  totalInstances: z.number(),
  runningInstances: z.number(),
  pendingInstances: z.number(),
  stoppedInstances: z.number(),
  errorInstances: z.number().optional(),
  totalCpu: z.number().optional(),
  totalMemory: z.number().optional(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
