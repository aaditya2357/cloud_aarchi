import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Instance } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, StopCircle, MoreVertical, Play, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUptime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type InstanceListProps = {
  instances?: Instance[];
  isLoading: boolean;
  onRefresh: () => void;
  onFiltersChange: (filters: { provider?: string, status?: string, search?: string }) => void;
};

export function InstanceList({ instances, isLoading, onRefresh, onFiltersChange }: InstanceListProps) {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("");
  const { toast } = useToast();

  const handleAction = async (instanceId: number, action: 'start' | 'stop' | 'restart') => {
    try {
      await apiRequest('POST', `/api/instances/${instanceId}/action`, { action });
      
      const actionMessages = {
        start: 'VM starting...',
        stop: 'VM stopping...',
        restart: 'VM restarting...'
      };
      
      toast({
        title: 'Success',
        description: actionMessages[action],
      });
      
      // Refresh the list to show updated status
      setTimeout(onRefresh, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} the instance. Please try again.`,
        variant: 'destructive'
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    onFiltersChange({ provider, status, search: value });
  };

  const handleProviderChange = (value: string) => {
    setProvider(value);
    onFiltersChange({ provider: value === "all" ? "" : value, status, search });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFiltersChange({ provider, status: value === "all" ? "" : value, search });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws':
        return (
          <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case 'gcp':
        return (
          <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'openstack':
        return (
          <svg className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      default:
        return <Server className="flex-shrink-0 h-5 w-5 text-gray-400 mr-1.5" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">VM Instances</CardTitle>
        <div className="mt-3 md:mt-0 flex flex-col sm:flex-row">
          <div className="relative rounded-md shadow-sm max-w-xs">
            <Input 
              type="text" 
              placeholder="Search instances..." 
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-2">
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openstack">OpenStack</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="gcp">GCP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resources
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uptime
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div className="ml-4">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-2 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-16" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end">
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </td>
                </tr>
              ))
            ) : instances && instances.length > 0 ? (
              instances.map((instance) => (
                <tr key={instance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-gray-100">
                        <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instance.name}</div>
                        <div className="text-sm text-gray-500">{instance.instanceId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(instance.status)}`}>
                      {instance.status.charAt(0).toUpperCase() + instance.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getProviderIcon(instance.provider)}
                      <span className="text-sm text-gray-900">{instance.provider.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span>{instance.ipAddress || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instance.cpu} vCPU / {instance.memory} GB RAM</div>
                    <div className="flex mt-1 items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${instance.status === 'running' ? 'bg-primary' : 'bg-gray-400'} rounded-full h-2`}
                          style={{ width: `${instance.cpuUsage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{instance.cpuUsage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span>{instance.status === 'running' ? formatUptime(instance.uptime) : '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {instance.status === 'running' ? (
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleAction(instance.id, 'restart')}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <RefreshCw className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Restart</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleAction(instance.id, 'stop')}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <StopCircle className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Stop</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      ) : instance.status === 'stopped' ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleAction(instance.id, 'start')}
                                className="text-primary hover:text-primary-dark"
                              >
                                <Play className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Start</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No instances found. Try clearing filters or refreshing.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </a>
          <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </a>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{instances?.length || 0}</span> of <span className="font-medium">{instances?.length || 0}</span> results
            </p>
          </div>
          {/* Pagination can be implemented here if needed */}
        </div>
      </div>
    </Card>
  );
}
