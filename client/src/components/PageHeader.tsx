import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function PageHeader({ title, subtitle, onRefresh, isRefreshing = false }: PageHeaderProps) {
  return (
    <div className="pb-5 border-b border-gray-200 flex flex-col md:flex-row justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="mt-4 md:mt-0 flex">
        <span className="shadow-sm rounded-md">
          <Button 
            variant="outline" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="inline-flex items-center"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </span>
        <span className="ml-3 shadow-sm rounded-md">
          <Button className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Instance
          </Button>
        </span>
      </div>
    </div>
  );
}
