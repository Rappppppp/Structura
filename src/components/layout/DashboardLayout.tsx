import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { useSidebarStore } from '@/stores/sidebar.store';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isCollapsed } = useSidebarStore();
  
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-background/50">
      <AppSidebar />
      <div className={`flex flex-1 flex-col w-full transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <AppHeader />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
