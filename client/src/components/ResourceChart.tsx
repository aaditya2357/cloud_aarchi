import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ResourceData = {
  name: string;
  usage: number;
};

type ResourceChartProps = {
  title: string;
  data?: ResourceData[];
  isLoading: boolean;
  color: string;
};

export function ResourceChart({ title, data, isLoading, color = "bg-primary" }: ResourceChartProps) {
  return (
    <Card>
      <CardHeader className="px-5 py-3 border-b border-gray-200">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="h-60 flex flex-col justify-end space-y-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-24 h-4 mr-2" />
                <Skeleton className="flex-1 h-6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-60 flex flex-col justify-end space-y-1">
            {data && data.length > 0 ? (
              data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-xs text-right pr-2 text-gray-500">{item.name}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-sm">
                    <div 
                      className={`h-6 ${color} rounded-sm chart-bar`} 
                      style={{ width: `${item.usage}%` }}
                    >
                      <div className="h-full flex items-center justify-end">
                        <span className="px-2 text-xs font-medium text-white">{item.usage}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500 text-sm">No data available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
