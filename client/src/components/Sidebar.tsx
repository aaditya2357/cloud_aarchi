import { Cloud, Server, Shield, Settings, Clock, FileText, Calendar } from "lucide-react";
import { useState } from "react";

type SidebarProps = {
  activeItem?: string;
  collapsed?: boolean;
};

export function Sidebar({ activeItem = "all", collapsed = false }: SidebarProps) {
  return (
    <div className="bg-white shadow-md w-64 hidden md:block flex-shrink-0 overflow-y-auto">
      <div className="px-4 py-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Cloud Providers
        </h3>
        <div className="mt-3 space-y-1">
          <SidebarItem 
            label="All Providers" 
            icon={<Cloud />} 
            active={activeItem === "all"} 
            href="#" 
          />
          <SidebarItem 
            label="OpenStack" 
            icon={<Server />} 
            active={activeItem === "openstack"} 
            href="#" 
          />
          <SidebarItem 
            label="AWS" 
            icon={<Server />} 
            active={activeItem === "aws"} 
            href="#" 
          />
          <SidebarItem 
            label="GCP" 
            icon={<Shield />} 
            active={activeItem === "gcp"} 
            href="#" 
          />
        </div>
      </div>
      <div className="px-4 py-5 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Management
        </h3>
        <div className="mt-3 space-y-1">
          <SidebarItem 
            label="Settings" 
            icon={<Settings />} 
            active={activeItem === "settings"} 
            href="#" 
          />
          <SidebarItem 
            label="Activity" 
            icon={<Clock />} 
            active={activeItem === "activity"} 
            href="#" 
          />
          <SidebarItem 
            label="Templates" 
            icon={<FileText />} 
            active={activeItem === "templates"} 
            href="#" 
          />
          <SidebarItem 
            label="Scheduled Tasks" 
            icon={<Calendar />} 
            active={activeItem === "scheduled"} 
            href="#" 
          />
        </div>
      </div>
    </div>
  );
}

type SidebarItemProps = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  href: string;
}

function SidebarItem({ label, icon, active, href }: SidebarItemProps) {
  const baseClasses = "flex items-center px-3 py-2 text-sm font-medium rounded-md";
  const activeClasses = "bg-primary bg-opacity-10 text-primary";
  const inactiveClasses = "text-gray-700 hover:bg-gray-50";
  
  return (
    <a href={href} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      <span className="mr-3 h-5 w-5">{icon}</span>
      {label}
    </a>
  );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex z-40 md:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">CloudStack</span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            <SidebarItem 
              label="All Providers" 
              icon={<Cloud />} 
              active={true} 
              href="#" 
            />
            <SidebarItem 
              label="OpenStack" 
              icon={<Server />} 
              href="#" 
            />
            <SidebarItem 
              label="AWS" 
              icon={<Server />}  
              href="#" 
            />
            <SidebarItem 
              label="GCP" 
              icon={<Shield />} 
              href="#" 
            />
            <div className="pt-3 mt-3 border-t border-gray-200">
              <SidebarItem 
                label="Settings" 
                icon={<Settings />} 
                href="#" 
              />
              <SidebarItem 
                label="Activity" 
                icon={<Clock />} 
                href="#" 
              />
              <SidebarItem 
                label="Templates" 
                icon={<FileText />} 
                href="#" 
              />
              <SidebarItem 
                label="Scheduled Tasks" 
                icon={<Calendar />} 
                href="#" 
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
