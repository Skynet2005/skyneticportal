// Use the required database client
'use client';

// Import required components and hooks
import DesktopItem from "./DesktopItem";
import useRoutes from "@/app/utils/messenger/useHooks/useRoutes";
import SettingsModal from "./SettingsModal";

// Import useState hook from React
import { useState } from "react";

// Import Avatar component
import Avatar from "../Avatar";

// Import User type from Prisma Client
import { User } from "@prisma/client";

// Define interface for DesktopSidebar props
interface DesktopSidebarProps {
  currentUser: User
}

// Create a functional component, DesktopSidebar
const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentUser
}) => {
  // Get the routes using the useRoutes custom hooks
  const routes = useRoutes();

  // Initialize state for controlling the SettingsModal open status
  const [isOpen, setIsOpen] = useState(false);

  return ( 
    <>
      {/* Render SettingsModal with the necessary props */}
      <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      {/* Define the main DesktopSidebar container */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-neutral-900 lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        
        {/* Navigation for the list of routes */}
        <nav className="mt-4 flex flex-col justify-between">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {/* Map through the routes and create a DesktopItem for each */}
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>

        {/* Navigation for the user avatar and SettingsModal trigger */}
        <nav className="mt-4 flex flex-col justify-between items-center">
          <div onClick={() => setIsOpen(true)} className="cursor-pointer hover:opacity-75 transition">
            {/* Render Avatar component with current user */}
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
}

// Export the DesktopSidebar component
export default DesktopSidebar;
