import { useState, useRef, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useClients } from '@/hooks/queries/useClients';
import { useUsers } from '@/hooks/queries/useUsers';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: projectsData } = useProjects(undefined, 1, 100);
  const { data: tasksData } = useTasks();
  const { data: clientsData } = useClients(1, 100);
  const { data: usersData } = useUsers(1, 100);

  const projects = Array.isArray(projectsData?.data) ? projectsData.data : [];
  const tasks = Array.isArray(tasksData?.data) ? tasksData.data : [];
  const clients = Array.isArray(clientsData?.data) ? clientsData.data : [];
  const users = Array.isArray(usersData?.data) ? usersData.data : [];

  // Combine and filter search results
  const searchResults = searchQuery.trim().length > 0
    ? [
        ...projects
          .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .map((p) => ({ type: 'project', id: p.id, title: p.name, path: `/projects/${p.id}` })),
        ...tasks
          .filter((t) => t.title?.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .map((t) => ({ type: 'task', id: t.id, title: t.title, path: `/tasks/${t.id}` })),
        ...clients
          .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .map((c) => ({ type: 'client', id: c.id, title: c.name, path: `/clients/${c.id}` })),
        ...users
          .filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 2)
          .map((u) => ({ type: 'user', id: u.id, title: u.name, path: `/users/${u.id}` })),
      ]
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setIsOpen(false);
  };

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
        <div ref={searchRef} className="relative hidden sm:block flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, tasks, files..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="h-10 w-full rounded-xl border border-border/30 bg-background/60 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all duration-300 hover:border-border/50"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {isOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-border">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result.path)}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{result.type}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
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
