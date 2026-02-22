import { ElementType, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FolderKanban, Users, Building2, MessageSquare,
  CreditCard, Brain, BarChart3, Settings, CheckSquare, Upload,
  Clock, FileText, Bot, LogOut, Grid3X3, Menu, X,
  PencilRuler
} from 'lucide-react';

type NavItem = { label: string; path: string; icon: ElementType };

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Teams', path: '/teams', icon: Users },
    { label: 'Clients', path: '/clients', icon: Building2 },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
    // { label: 'AI Insights', path: '/ai-insights', icon: Brain },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
  ],
  architect: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Design Uploads', path: '/uploads', icon: Upload },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'AI Assistant', path: '/ai-insights', icon: Brain },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
  ],
  engineer: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Design Uploads', path: '/uploads', icon: Upload },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    // { label: 'AI Assistant', path: '/ai-insights', icon: Brain },
  ],
  client: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', path: '/projects', icon: FolderKanban },
    { label: 'Timeline', path: '/timeline', icon: Clock },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'Chat', path: '/communication', icon: MessageSquare },
    // { label: 'AI Assistant', path: '/ai-insights', icon: Bot },
    { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
  ],
};

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (!user) return null;

  const items = navByRole[user.role];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 brightness-0 invert" />
          <span className="text-lg font-bold tracking-tight text-sidebar-primary-foreground">Structura</span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="md:hidden rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active
                ? 'bg-sidebar-accent text-sidebar-primary-foreground'
                : 'text-sidebar-accent-foreground hover:bg-sidebar-accent/50'
                }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-primary-foreground">{user.name}</p>
            <p className="truncate text-xs text-sidebar-muted capitalize">{user.role}</p>
          </div>
          <button onClick={logout} className="rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-card p-2 shadow-md border border-border text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-30 h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
