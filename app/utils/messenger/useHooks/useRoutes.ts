import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from "next-auth/react";
import useConversation from '@/app/utils/messenger/useHooks/useConversation';

// Custom hook to generate a list of navigation routes with respective icons and active states
const useRoutes = () => {
  // Get the current page's pathname using the usePathname hook from Next.js navigation
  const pathname = usePathname();
  
  // Access conversationId from the useConversation custom hook
  const { conversationId } = useConversation();

  // Compute the list of routes with their labels, hrefs, icons, and active states
  const routes = useMemo(() => [
    { 
      label: 'Chat', 
      href: '/messenger', 
      icon: HiChat, // Icon for the route
      active: pathname === '/messenger' || !!conversationId, // Active when the current path is /conversations or there exists a conversationId
    },
    { 
      label: 'Users', 
      href: '/users', 
      icon: HiUsers, // Icon for the route
      active: pathname === '/users', // Active when the current path is /users
    },
    {
      label: 'Logout', 
      onClick: () => signOut(), // Call the signOut function upon clicking this route
      href: '#',
      icon: HiArrowLeftOnRectangle, // Icon for the route
    }
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;
