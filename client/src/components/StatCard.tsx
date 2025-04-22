import { ArrowUp } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
};

export function StatCard({ title, value, change, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="flex items-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    {value}
                  </div>
                  {change && (
                    <span className="ml-2 flex items-center text-sm font-medium text-green-600">
                      <ArrowUp className="w-4 h-4" />
                      <span className="sr-only">Increased by</span>
                      {change}
                    </span>
                  )}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
