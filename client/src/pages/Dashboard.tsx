import { useState } from "react";
import { AppHeader, MobileNavbar } from "@/components/AppHeader";
import { Sidebar, MobileSidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { ResourceChart } from "@/components/ResourceChart";
import { InstanceList } from "@/components/InstanceList";
import { useInstances } from "@/hooks/use-instances";
import { useResourceUsage } from "@/hooks/use-instances";
import { useStats } from "@/hooks/use-instances";

export default function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<{ provider?: string; status?: string; search?: string }>({});
  
  // Fetch instances with potential filters
  const { 
    data: instances, 
    isLoading: instancesLoading, 
    refetch: refetchInstances 
  } = useInstances(filters);
  
  // Fetch resource usage
  const { 
    data: resourceUsage, 
    isLoading: resourceLoading,
    refetch: refetchResourceUsage
  } = useResourceUsage();
  
  // Fetch stats
  const { 
    data: stats, 
    isLoading: statsLoading,
    refetch: refetchStats 
  } = useStats();
  
  // Handle refresh all data
  const handleRefreshData = () => {
    refetchInstances();
    refetchResourceUsage();
    refetchStats();
  };
  
  // Handle filter changes
  const handleFiltersChange = (newFilters: { provider?: string; status?: string; search?: string }) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <AppHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeItem="all" />
        
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <PageHeader 
            title="Virtual Machine Dashboard" 
            subtitle="Manage your VM instances across all cloud providers" 
            onRefresh={handleRefreshData}
            isRefreshing={instancesLoading || resourceLoading || statsLoading}
          />
          
          <DashboardStats stats={stats} isLoading={statsLoading} />
          
          <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ResourceChart 
              title="CPU Usage" 
              data={resourceUsage?.cpu} 
              isLoading={resourceLoading}
              color="bg-primary"
            />
            <ResourceChart 
              title="Memory Usage" 
              data={resourceUsage?.memory} 
              isLoading={resourceLoading}
              color="bg-accent"
            />
          </div>
          
          <InstanceList 
            instances={instances} 
            isLoading={instancesLoading}
            onRefresh={refetchInstances}
            onFiltersChange={handleFiltersChange}
          />
        </main>
      </div>
      
      <MobileNavbar onOpenMenu={() => setMobileMenuOpen(true)} />
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
}
