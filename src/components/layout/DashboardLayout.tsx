import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen w-full">
    <AppSidebar />
    <div className="md:ml-60 flex flex-1 flex-col w-full">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
