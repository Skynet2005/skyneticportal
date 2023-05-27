'use client';

import useConversation from "@/app/utils/messenger/useHooks/useConversation";
import useRoutes from "@/app/utils/messenger/useHooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return ( 
    <div 
      className="fixed justify-between w-full bottom-0 z-40 flex items-center lg:bg-neutral-800 border-t-[1px] lg:hidden">
      {routes.map((route) => (
        <MobileItem 
          key={route.href} 
          href={route.href} 
          active={route.active} 
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
}

export default MobileFooter;