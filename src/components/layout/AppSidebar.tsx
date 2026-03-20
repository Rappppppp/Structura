import { ElementType, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FolderKanban, Users, Building2, MessageSquare,
  CreditCard, Brain, BarChart3, Settings, CheckSquare, Upload,
  Clock, FileText, Bot, LogOut, Grid3X3, Menu, X, Sidebar as SidebarIcon, ChevronLeft,
  PencilRuler, ClipboardList
} from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar.store';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = { label: string; path: string; icon: ElementType };

const navByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    // { label: 'Teams', path: '/teams', icon: Users },
    { label: 'Clients', path: '/clients', icon: Building2 },
    { label: 'Users', path: '/users', icon: Grid3X3 },
    { label: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Payments', path: '/payments', icon: CreditCard },
    { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
    // { label: 'AI Insights', path: '/ai-insights', icon: Brain },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    // { label: 'Settings', path: '/settings', icon: Settings },
  ],
  architect: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Design Uploads', path: '/uploads', icon: Upload },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
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
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    // { label: 'AI Assistant', path: '/ai-insights', icon: Brain },
  ],
  project_manager: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Teams', path: '/teams', icon: Users },
    { label: 'Communication', path: '/communication', icon: MessageSquare },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
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
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  if (!user) return null;

  const items = navByRole[user.role];

  const sidebarContent = (
    <>
      {/* Logo & Collapse Button */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1">
            <img src="/logo.png" alt="Logo" className="h-7 w-7" />
            <span className="text-base font-bold tracking-tight text-sidebar-foreground truncate">Structura</span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className="md:flex hidden rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent/20 transition-colors ml-auto"
          aria-label="Toggle sidebar"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        <button onClick={() => setMobileOpen(false)} className="md:hidden rounded-lg p-1.5 text-sidebar-muted hover:bg-sidebar-accent/20 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          const navItem = (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-muted hover:bg-sidebar-accent/30 hover:text-sidebar-foreground'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  {navItem}
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }
          return navItem;
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent/20 transition-colors">
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-xs text-sidebar-muted capitalize">{user.role}</p>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={logout} className="rounded-md p-1.5 text-sidebar-muted hover:bg-primary/20 hover:text-primary transition-colors shrink-0">
                <LogOut className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Logout
            </TooltipContent>
          </Tooltip>
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
      <aside className={`hidden md:flex fixed left-0 top-0 z-30 h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
