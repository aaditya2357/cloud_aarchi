import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { VmStatusEnum, CloudProviderEnum } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/instances", async (req: Request, res: Response) => {
    try {
      // Apply filters
      const provider = req.query.provider as string;
      const status = req.query.status as string;
      const search = req.query.search as string;
      
      let instances = await storage.getAllInstances();
      
      // Apply provider filter
      if (provider && CloudProviderEnum.safeParse(provider).success) {
        instances = instances.filter(instance => instance.provider === provider);
      }
      
      // Apply status filter
      if (status && VmStatusEnum.safeParse(status).success) {
        instances = instances.filter(instance => instance.status === status);
      }
      
      // Apply search filter
      if (search && search.trim() !== '') {
        const searchLower = search.toLowerCase();
        instances = instances.filter(instance => 
          instance.name.toLowerCase().includes(searchLower) || 
          instance.instanceId.toLowerCase().includes(searchLower) ||
          (instance.ipAddress && instance.ipAddress.includes(searchLower))
        );
      }
      
      res.json(instances);
    } catch (error) {
      console.error("Error fetching instances:", error);
      res.status(500).json({ message: "Failed to fetch instances" });
    }
  });

  app.get("/api/instances/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid instance ID" });
      }
      
      const instance = await storage.getInstance(id);
      if (!instance) {
        return res.status(404).json({ message: "Instance not found" });
      }
      
      res.json(instance);
    } catch (error) {
      console.error("Error fetching instance:", error);
      res.status(500).json({ message: "Failed to fetch instance" });
    }
  });

  app.post("/api/instances/:id/action", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid instance ID" });
      }
      
      const instance = await storage.getInstance(id);
      if (!instance) {
        return res.status(404).json({ message: "Instance not found" });
      }
      
      const actionSchema = z.object({
        action: z.enum(['start', 'stop', 'restart'])
      });
      
      const parsedBody = actionSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid action" });
      }
      
      const { action } = parsedBody.data;
      
      // Perform the requested action
      switch (action) {
        case 'start':
          if (instance.status === 'running') {
            return res.status(400).json({ message: "Instance is already running" });
          }
          await storage.updateInstance(id, { 
            status: 'running',
            cpuUsage: Math.floor(Math.random() * 30) + 20, // Random value between 20-50%
            memoryUsage: Math.floor(Math.random() * 30) + 20 // Random value between 20-50%
          });
          break;
        
        case 'stop':
          if (instance.status === 'stopped') {
            return res.status(400).json({ message: "Instance is already stopped" });
          }
          await storage.updateInstance(id, { 
            status: 'stopped',
            cpuUsage: 0,
            memoryUsage: 0,
            uptime: 0
          });
          break;
        
        case 'restart':
          // Temporarily set to pending
          await storage.updateInstance(id, { status: 'pending' });
          
          // After a short delay, set back to running
          setTimeout(async () => {
            await storage.updateInstance(id, { 
              status: 'running',
              cpuUsage: Math.floor(Math.random() * 30) + 20,
              memoryUsage: Math.floor(Math.random() * 30) + 20
            });
          }, 5000);
          break;
      }
      
      // Return the updated instance
      const updatedInstance = await storage.getInstance(id);
      res.json(updatedInstance);
    } catch (error) {
      console.error(`Error performing action on instance:`, error);
      res.status(500).json({ message: "Failed to perform action on instance" });
    }
  });

  app.get("/api/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  app.get("/api/resource-usage", async (req: Request, res: Response) => {
    try {
      // Get resource usage for all instances or filtered by provider
      const provider = req.query.provider as string;
      
      let instances = await storage.getAllInstances();
      
      // Apply provider filter if provided
      if (provider && CloudProviderEnum.safeParse(provider).success) {
        instances = instances.filter(instance => instance.provider === provider);
      }
      
      // Get only running instances for resource usage
      instances = instances.filter(instance => instance.status === 'running');
      
      // Build CPU and memory usage data
      const cpuData = instances.map(instance => ({
        name: instance.name,
        usage: instance.cpuUsage
      }));
      
      const memoryData = instances.map(instance => ({
        name: instance.name,
        usage: instance.memoryUsage
      }));
      
      res.json({
        cpu: cpuData,
        memory: memoryData
      });
    } catch (error) {
      console.error("Error fetching resource usage:", error);
      res.status(500).json({ message: "Failed to fetch resource usage data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
