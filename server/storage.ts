import { 
  instances, 
  type Instance, 
  type InsertInstance, 
  type ResourceUsage, 
  type InsertResourceUsage, 
  type DashboardStats,
  type VmStatus,
  resourceUsage
} from "@shared/schema";

// Storage interface for VM instances
export interface IStorage {
  // Instance operations
  getAllInstances(): Promise<Instance[]>;
  getInstance(id: number): Promise<Instance | undefined>;
  getInstanceByInstanceId(instanceId: string): Promise<Instance | undefined>;
  createInstance(instance: InsertInstance): Promise<Instance>;
  updateInstance(id: number, update: Partial<InsertInstance>): Promise<Instance | undefined>;
  deleteInstance(id: number): Promise<boolean>;
  
  // Filtering operations
  getInstancesByProvider(provider: string): Promise<Instance[]>;
  getInstancesByStatus(status: VmStatus): Promise<Instance[]>;
  
  // Resource usage operations
  getResourceUsage(instanceId: number): Promise<ResourceUsage[]>;
  addResourceUsage(usage: InsertResourceUsage): Promise<ResourceUsage>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<DashboardStats>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private instances: Map<number, Instance>;
  private resourceUsages: Map<number, ResourceUsage[]>;
  private currentInstanceId: number;
  private currentResourceUsageId: number;

  constructor() {
    this.instances = new Map();
    this.resourceUsages = new Map();
    this.currentInstanceId = 1;
    this.currentResourceUsageId = 1;
    
    // Add some example VMs for development
    this.setupSampleData();
  }

  // Instance operations
  async getAllInstances(): Promise<Instance[]> {
    return Array.from(this.instances.values());
  }

  async getInstance(id: number): Promise<Instance | undefined> {
    return this.instances.get(id);
  }

  async getInstanceByInstanceId(instanceId: string): Promise<Instance | undefined> {
    return Array.from(this.instances.values()).find(
      (instance) => instance.instanceId === instanceId
    );
  }

  async createInstance(instance: InsertInstance): Promise<Instance> {
    const id = this.currentInstanceId++;
    const now = new Date();
    const newInstance: Instance = {
      ...instance,
      id,
      createdAt: now,
      lastUpdated: now,
      metadata: instance.metadata || {}
    };
    this.instances.set(id, newInstance);
    return newInstance;
  }

  async updateInstance(id: number, update: Partial<InsertInstance>): Promise<Instance | undefined> {
    const instance = this.instances.get(id);
    if (!instance) return undefined;
    
    const updatedInstance: Instance = {
      ...instance,
      ...update,
      lastUpdated: new Date()
    };
    this.instances.set(id, updatedInstance);
    return updatedInstance;
  }

  async deleteInstance(id: number): Promise<boolean> {
    return this.instances.delete(id);
  }

  // Filtering operations
  async getInstancesByProvider(provider: string): Promise<Instance[]> {
    return Array.from(this.instances.values()).filter(
      (instance) => instance.provider === provider
    );
  }

  async getInstancesByStatus(status: VmStatus): Promise<Instance[]> {
    return Array.from(this.instances.values()).filter(
      (instance) => instance.status === status
    );
  }

  // Resource usage operations
  async getResourceUsage(instanceId: number): Promise<ResourceUsage[]> {
    return this.resourceUsages.get(instanceId) || [];
  }

  async addResourceUsage(usage: InsertResourceUsage): Promise<ResourceUsage> {
    const id = this.currentResourceUsageId++;
    const now = new Date();
    const newUsage: ResourceUsage = {
      ...usage,
      id,
      timestamp: now
    };
    
    const instanceUsages = this.resourceUsages.get(usage.instanceId) || [];
    instanceUsages.push(newUsage);
    this.resourceUsages.set(usage.instanceId, instanceUsages);
    
    // Update instance with latest resource usage
    const instance = await this.getInstance(usage.instanceId);
    if (instance) {
      await this.updateInstance(usage.instanceId, {
        cpuUsage: usage.cpuUsage,
        memoryUsage: usage.memoryUsage
      });
    }
    
    return newUsage;
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const allInstances = Array.from(this.instances.values());
    const runningInstances = allInstances.filter(i => i.status === 'running');
    const pendingInstances = allInstances.filter(i => i.status === 'pending');
    const stoppedInstances = allInstances.filter(i => i.status === 'stopped');
    const errorInstances = allInstances.filter(i => i.status === 'error');
    
    return {
      totalInstances: allInstances.length,
      runningInstances: runningInstances.length,
      pendingInstances: pendingInstances.length,
      stoppedInstances: stoppedInstances.length,
      errorInstances: errorInstances.length,
      totalCpu: allInstances.reduce((sum, instance) => sum + instance.cpu, 0),
      totalMemory: allInstances.reduce((sum, instance) => sum + instance.memory, 0)
    };
  }

  // Helper method to set up initial data
  private setupSampleData(): void {
    // AWS instances
    this.createInstance({
      name: "web-server-01",
      instanceId: "i-1234abcd56ef",
      status: "running",
      provider: "aws",
      ipAddress: "172.31.45.231",
      cpu: 2,
      memory: 4,
      cpuUsage: 65,
      memoryUsage: 48,
      uptime: 1058112, // 12 days 5 hours 32 minutes
      metadata: { region: "us-east-1", type: "t2.medium" }
    });
    
    this.createInstance({
      name: "app-server-02",
      instanceId: "i-5432abcd56ef",
      status: "stopped",
      provider: "aws",
      ipAddress: "",
      cpu: 2,
      memory: 4,
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
      metadata: { region: "us-west-2", type: "t2.medium" }
    });

    // GCP instances
    this.createInstance({
      name: "db-server-01",
      instanceId: "gce-5678xyz",
      status: "running",
      provider: "gcp",
      ipAddress: "10.142.15.193",
      cpu: 4,
      memory: 16,
      cpuUsage: 42,
      memoryUsage: 83,
      uptime: 766182, // 8 days 19 hours 47 minutes
      metadata: { zone: "us-central1-a", machineType: "n2-standard-4" }
    });
    
    this.createInstance({
      name: "backend-01",
      instanceId: "gce-9876xyz",
      status: "running",
      provider: "gcp",
      ipAddress: "10.142.16.78",
      cpu: 4,
      memory: 8,
      cpuUsage: 52,
      memoryUsage: 56,
      uptime: 478758, // 5 days 12 hours 18 minutes
      metadata: { zone: "us-central1-b", machineType: "n2-standard-2" }
    });

    // OpenStack instance
    this.createInstance({
      name: "app-server-01",
      instanceId: "inst-openstack-123",
      status: "pending",
      provider: "openstack",
      ipAddress: "192.168.1.45",
      cpu: 8,
      memory: 16,
      cpuUsage: 78,
      memoryUsage: 62,
      uptime: 5003, // 1 hour 23 minutes
      metadata: { flavor: "m1.large", region: "region1" }
    });
  }
}

// Export storage instance
export const storage = new MemStorage();
