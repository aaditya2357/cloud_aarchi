import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type AppHeaderProps = {
  onOpenMobileMenu: () => void;
};

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  const [userInitials, setUserInitials] = useState("MA");
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">CloudStack</span>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="#" className="border-primary text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Templates
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Networks
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Storage
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-6 w-6 text-gray-400 hover:text-gray-500" />
              <span className="sr-only">View notifications</span>
            </Button>
            <div className="ml-3 relative">
              <div>
                <Button variant="ghost" className="rounded-full p-0" aria-expanded="false" id="user-menu-button">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                    {userInitials}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileNavbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <div className="md:hidden bg-white border-t">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between py-3 px-4">
          <Button variant="ghost" onClick={onOpenMenu}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
