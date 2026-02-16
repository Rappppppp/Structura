import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 md:hidden" />
      <div className="relative hidden sm:block w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects, tasks, files..."
          className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
