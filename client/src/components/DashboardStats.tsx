import { StatCard } from "@/components/StatCard";
import { DashboardStats as DashboardStatsType } from "@shared/schema";
import { Server, CheckCircle, Clock, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStatsProps = {
  stats?: DashboardStatsType;
  isLoading: boolean;
};

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="ml-5 w-0 flex-1">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Total Instances"
        value={stats.totalInstances}
        change={3}
        icon={<Server className="h-6 w-6 text-primary" />}
        bgColor="bg-primary bg-opacity-10"
        textColor="text-primary"
      />
      
      <StatCard
        title="Running"
        value={stats.runningInstances}
        icon={<CheckCircle className="h-6 w-6 text-secondary" />}
        bgColor="bg-green-100"
        textColor="text-secondary"
      />
      
      <StatCard
        title="Pending"
        value={stats.pendingInstances}
        icon={<Clock className="h-6 w-6 text-warning" />}
        bgColor="bg-yellow-100"
        textColor="text-warning"
      />
      
      <StatCard
        title="Stopped"
        value={stats.stoppedInstances}
        icon={<XCircle className="h-6 w-6 text-danger" />}
        bgColor="bg-red-100"
        textColor="text-danger"
      />
    </div>
  );
}
