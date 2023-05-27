import getCurrentUser from '@/app/utils/messenger/getActions/getCurrentUser';

import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

async function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full bg-black">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;