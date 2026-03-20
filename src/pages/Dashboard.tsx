import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TrendCard from '@/components/dashboard/TrendCard';
import ActivityFeed, { ActivityItem } from '@/components/dashboard/ActivityFeed';
import QuickActions, { QuickAction } from '@/components/dashboard/QuickActions';
import ProgressCard from '@/components/dashboard/ProgressCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useProjectStatusData } from '@/hooks/queries/useProjects';
import { useInvoices } from '@/hooks/queries/useInvoices';
import { useChatRooms } from '@/hooks/queries/useCommunication';
import {
  FolderKanban,
  Clock,
  MessageSquare,
  CreditCard,
  Plus,
  FileText,
  Users,
  Settings,
  BarChart3,
  Zap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const DashboardContent = () => {
  const navigate = useNavigate();
  const { data: projectsData, isLoading: projectsLoading } = useProjects(undefined, 1, 50);
  const { data: statusData, isLoading: statusLoading } = useProjectStatusData();
  const { data: tasksData, isLoading: tasksLoading } = useTasks();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices(1, 100);
  const { data: chatData, isLoading: chatLoading } = useChatRooms();

  const projects = projectsData?.data || [];
  const tasks = tasksData?.data || [];
  const invoices = invoicesData?.data || [];
  const chatRooms = chatData?.data || [];

  const activeProjectsCount = projects.filter((project) => project.status === 'active').length;
  const completedProjectsCount = projects.filter((project) => project.status === 'completed').length;
  const onHoldProjects = projects.filter((project) => project.status === 'on-hold').length;
  const reviewProjectsCount = projects.filter((project) => project.status === 'review').length;
  const cancelledProjectsCount = projects.filter((project) => project.status === 'cancelled').length;
  const pendingTasksCount = tasks.filter((task) => task.status !== 'done').length;
  const completedTasksCount = tasks.filter((task) => task.status === 'done').length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status !== 'paid');
  const pendingInvoiceAmount = pendingInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');

  const upcomingDeadlines = projects
    .filter((project) => project.deadline !== 'N/A')
    .map((project) => ({
      ...project,
      deadlineDate: new Date(project.deadline),
    }))
    .filter((project) => !Number.isNaN(project.deadlineDate.getTime()))
    .sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime())
    .slice(0, 5);

  const analytics = statusData?.data;
  const chartData = [
    {
      name: 'Project Status',
      active: activeProjectsCount,
      completed: completedProjectsCount,
      onHold: onHoldProjects,
      review: reviewProjectsCount,
      cancelled: cancelledProjectsCount,
    }
  ];

  const pieChartData = [
    { name: 'Active', value: activeProjectsCount, color: 'hsl(217 91% 50%)' },
    { name: 'Completed', value: completedProjectsCount, color: 'hsl(162 63% 41%)' },
    { name: 'On Hold', value: onHoldProjects, color: 'hsl(43 96% 56%)' },
    { name: 'Review', value: reviewProjectsCount, color: 'hsl(271 91% 55%)' },
    { name: 'Cancelled', value: cancelledProjectsCount, color: 'hsl(0 84% 60%)' },
  ].filter(item => item.value > 0);

  // Activity feed items
  const activityItems: ActivityItem[] = [
    ...projects.slice(0, 3).map((project) => ({
      id: `project-${project.id}`,
      title: `Project: ${project.name}`,
      description: project.client,
      icon: FolderKanban,
      timestamp: new Date(),
      type: 'project' as const,
    })),
    ...pendingInvoices.slice(0, 2).map((invoice) => ({
      id: `invoice-${invoice.id}`,
      title: `Invoice #${invoice.id}`,
      description: `₱${invoice.amount.toLocaleString()} pending`,
      icon: CreditCard,
      timestamp: new Date(),
      type: 'payment' as const,
    })),
  ];

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: 'new-project',
      label: 'New Project',
      icon: Plus,
      color: 'blue',
      onClick: () => navigate('/projects?modal=new'),
    },
    {
      id: 'new-task',
      label: 'New Task',
      icon: CheckCircle2,
      color: 'purple',
      onClick: () => navigate('/tasks?modal=new'),
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
      color: 'green',
      onClick: () => navigate('/payments'),
    },
    {
      id: 'team',
      label: 'Team',
      icon: Users,
      color: 'orange',
      onClick: () => navigate('/teams'),
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      color: 'pink',
      onClick: () => navigate('/reports'),
    },
    // {
    //   id: 'settings',
    //   label: 'Settings',
    //   icon: Settings,
    //   color: 'red',
    //   onClick: () => navigate('/settings'),
    // },
  ];

  if (projectsLoading || statusLoading || tasksLoading || invoicesLoading || chatLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 rounded-full border-4 border-border border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TrendCard
          icon={FolderKanban}
          title="Active Projects"
          value={activeProjectsCount}
          subtitle={`${projects.length} total`}
          trend={Math.round((activeProjectsCount / (projects.length || 1)) * 100)}
          accentColor="blue"
        />
        <TrendCard
          icon={Clock}
          title="Pending Tasks"
          value={pendingTasksCount}
          subtitle={`${completedTasksCount} completed`}
          trend={Math.round((completedTasksCount / (tasks.length || 1)) * 100)}
          accentColor="purple"
        />
        <TrendCard
          icon={CreditCard}
          title="Revenue Pending"
          value={`₱${(pendingInvoiceAmount / 1000).toFixed(0)}k`}
          subtitle={`${pendingInvoices.length} invoices`}
          trend={-Math.round((pendingInvoices.length / (invoices.length || 1)) * 100)}
          accentColor="green"
        />
        <TrendCard
          icon={MessageSquare}
          title="Communications"
          value={chatRooms.length}
          subtitle="Chat rooms"
          trend={12}
          accentColor="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-card-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <QuickActions actions={quickActions} />
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Project Status Overview */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="mb-6 text-lg font-bold text-card-foreground">Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid hsl(220 13% 91%)',
                  fontSize: 13,
                  backgroundColor: 'hsl(0 0% 100%)',
                }}
              />
              <Legend />
              <Bar dataKey="active" fill="hsl(217 91% 50%)" radius={[4, 4, 0, 0]} name="Active" />
              <Bar dataKey="completed" fill="hsl(162 63% 41%)" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="onHold" fill="hsl(43 96% 56%)" radius={[4, 4, 0, 0]} name="On Hold" />
              <Bar dataKey="review" fill="hsl(271 91% 55%)" radius={[4, 4, 0, 0]} name="Review" />
              <Bar dataKey="cancelled" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Distribution */}
        {pieChartData.length > 0 && (
          <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
            <h3 className="mb-4 text-lg font-bold text-card-foreground w-full">Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Project Progress and Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Projects Progress */}
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-card-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Active Projects Progress
          </h3>
          <div className="space-y-4">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="group p-4 rounded-xl border border-border/50 bg-background/30 hover:bg-background/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-card-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{project.client || 'Unknown Client'}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Progress</span>
                    <span className="text-sm font-bold text-primary">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No active projects</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-card-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Recent Activity
          </h3>
          <ActivityFeed items={activityItems} maxItems={4} />
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-bold text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Upcoming Deadlines
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingDeadlines.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl border border-border/50 bg-gradient-to-br from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-colors group cursor-pointer"
              >
                <p className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">{project.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{project.client || 'Unknown'}</p>
                <p className="text-sm font-bold text-primary mt-3">{project.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-base text-muted-foreground mt-2">Here's your project performance overview.</p>
          </div>
        </div>
      </div>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
