import { useQuery } from "@tanstack/react-query";
import { Instance, DashboardStats } from "@shared/schema";
import { ResourceUsageData } from "@/lib/types";

// Get all instances with optional filtering
export function useInstances(filters?: { provider?: string; status?: string; search?: string }) {
  const queryParams = new URLSearchParams();
  
  if (filters?.provider) queryParams.append('provider', filters.provider);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.search) queryParams.append('search', filters.search);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<Instance[]>({ 
    queryKey: ['/api/instances' + queryString],
    refetchInterval: false
  });
}

// Get individual instance by ID
export function useInstance(id: number) {
  return useQuery<Instance>({ 
    queryKey: [`/api/instances/${id}`],
    enabled: !!id,
  });
}

// Get dashboard statistics
export function useStats() {
  return useQuery<DashboardStats>({ 
    queryKey: ['/api/stats'],
  });
}

// Get resource usage data
export function useResourceUsage(provider?: string) {
  const queryParams = new URLSearchParams();
  if (provider) queryParams.append('provider', provider);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery<ResourceUsageData>({ 
    queryKey: ['/api/resource-usage' + queryString],
  });
}
