import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AppHeader = () => {
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 w-full backdrop-blur-md bg-card/80 border-b border-border/20 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Spacer for mobile hamburger */}
        <div className="w-10 md:hidden" />
        
        {/* Search Bar */}
        <div className="relative hidden sm:block flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, tasks, files..."
            className="h-10 w-full rounded-xl border border-border/30 bg-background/60 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-300 hover:border-border/50"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4 ms-auto">
          {/* Notifications */}
          <button className="group relative rounded-lg p-2.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-200">
            <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse shadow-lg shadow-destructive/50" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-border/50 group-hover:border-primary/30 transition-colors text-sm font-semibold text-primary">
              {getInitials(user?.name)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
