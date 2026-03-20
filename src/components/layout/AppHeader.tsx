import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AppHeader = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/50 bg-gradient-to-r from-card via-card to-card/80 px-4 md:px-6 shadow-sm">
      {/* Spacer for mobile hamburger */}
      <div className="w-10 md:hidden" />
      <div className="relative hidden sm:block w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects, tasks, files..."
          className="h-10 w-full rounded-lg border border-border/50 bg-background/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-200">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </button>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
