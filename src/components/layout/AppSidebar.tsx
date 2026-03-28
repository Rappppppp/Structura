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
type NavSection = { title?: string; items: NavItem[] };

const navByRole: Record<UserRole, NavSection[]> = {
  admin: [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Projects', path: '/projects', icon: FolderKanban },
        { label: 'Clients', path: '/clients', icon: Building2 },
        { label: 'Users', path: '/users', icon: Grid3X3 },
      ]
    },
    {
      title: 'Team',
      items: [
        { label: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
        { label: 'Communication', path: '/communication', icon: MessageSquare },
      ]
    },
    {
      title: 'Finance & Reports',
      items: [
        { label: 'Payments', path: '/payments', icon: CreditCard },
        { label: 'Reports', path: '/reports', icon: BarChart3 },
      ]
    },
    // {
    //   title: 'Tools',
    //   items: [
    //     { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
    //     { label: 'Image Generations', path: '/image-generations', icon: PencilRuler },
    //   ]
    // },
  ],
  architect: [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'My Work',
      items: [
        { label: 'My Projects', path: '/projects', icon: FolderKanban },
        { label: 'Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Design Uploads', path: '/uploads', icon: Upload },
      ]
    },
    {
      title: 'Collaboration',
      items: [
        { label: 'Communication', path: '/communication', icon: MessageSquare },
        { label: 'Attendance', path: '/attendance', icon: ClipboardList },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'AI Assistant', path: '/ai-insights', icon: Brain },
        { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
        { label: 'Image Generations', path: '/image-generations', icon: PencilRuler },
        { label: 'Reports', path: '/reports', icon: BarChart3 },
      ]
    },
  ],
  engineer: [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'My Work',
      items: [
        { label: 'My Projects', path: '/projects', icon: FolderKanban },
        { label: 'Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Design Uploads', path: '/uploads', icon: Upload },
      ]
    },
    {
      title: 'Collaboration',
      items: [
        { label: 'Communication', path: '/communication', icon: MessageSquare },
        { label: 'Attendance', path: '/attendance', icon: ClipboardList },
      ]
    },
  ],
  project_manager: [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Projects',
      items: [
        { label: 'Projects', path: '/projects', icon: FolderKanban },
        { label: 'Teams', path: '/teams', icon: Users },
      ]
    },
    {
      title: 'Team Management',
      items: [
        { label: 'Attendance', path: '/attendance', icon: ClipboardList },
        { label: 'Communication', path: '/communication', icon: MessageSquare },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { label: 'Reports', path: '/reports', icon: BarChart3 },
      ]
    },
  ],
  client: [
    {
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Projects',
      items: [
        { label: 'My Projects', path: '/projects', icon: FolderKanban },
        { label: 'Timeline', path: '/timeline', icon: Clock },
        { label: 'Documents', path: '/documents', icon: FileText },
      ]
    },
    {
      title: 'Financials',
      items: [
        { label: 'Payments', path: '/payments', icon: CreditCard },
      ]
    },
    {
      title: 'Communication',
      items: [
        { label: 'Chat', path: '/communication', icon: MessageSquare },
      ]
    },
    {
      title: 'Tools',
      items: [
        { label: 'AI Design Assistant', path: '/ai-design-assistant', icon: PencilRuler },
        { label: 'Image Generations', path: '/image-generations', icon: PencilRuler },
      ]
    },
  ],
};

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  if (!user) return null;

  const sections = navByRole[user.role];

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
          className={`md:flex hidden rounded-md p-1.5 text-sidebar-muted hover:bg-sidebar-accent/20 transition-colors ${isCollapsed && 'w-full justify-center'}`}
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
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {sections.map((section, idx) => (
          <div key={idx} className={idx !== 0 ? "pt-1.5" : ""}>
            {section.title && !isCollapsed && (
              <div className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider border-b border-sidebar-border text-white/60">
                {section.title}
              </div>
            )}
            {section.title && isCollapsed && idx !== 0 && (
              <div className="my-0.5 mx-2 border-t border-sidebar-border" />
            )}
            {section.items.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const navItem = (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center ${isCollapsed && 'justify-center'} gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
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
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 p-2 rounded-md transition-colors">
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.name}</p>
              <p className="truncate text-xs text-sidebar-muted capitalize">{user.role}</p>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={logout} className="rounded-md p-1.5 text-sidebar-muted hover:bg-primary/20 hover:text-white transition-colors shrink-0">
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
