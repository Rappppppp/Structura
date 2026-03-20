import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { useSidebarStore } from '@/stores/sidebar.store';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { isCollapsed } = useSidebarStore();
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className={`flex flex-1 flex-col w-full transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
