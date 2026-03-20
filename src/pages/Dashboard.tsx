import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjects } from '@/hooks/queries/useProjects';
import { useTasks } from '@/hooks/queries/useTasks';
import { useProjectStatusData } from '@/hooks/queries/useProjects';
import { useInvoices } from '@/hooks/queries/useInvoices';
import { useChatRooms } from '@/hooks/queries/useCommunication';
import { FolderKanban, Clock, MessageSquare, CreditCard } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
const DashboardContent = () => {
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
  const pendingTasksCount = tasks.filter((task) => task.status !== 'done').length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status !== 'paid');
  const pendingInvoiceAmount = pendingInvoices.reduce((total, invoice) => total + invoice.amount, 0);

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
  const chartData = analytics
    ? [{
        month: 'Current',
        active: analytics.active_projects || 0,
        completed: analytics.completed_projects || 0,
        onHold: analytics.on_hold_projects || 0,
      }]
    : [];

  if (projectsLoading || statusLoading || tasksLoading || invoicesLoading || chatLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderKanban} title="Active Projects" value={activeProjectsCount} change={`${projects.length} total projects`} changeType="positive" />
        <StatCard icon={Clock} title="Pending Tasks" value={pendingTasksCount} change={`${tasks.length} total tasks`} changeType="neutral" />
        <StatCard icon={MessageSquare} title="Chat Rooms" value={chatRooms.length} change="Project communications" changeType="neutral" />
        <StatCard icon={CreditCard} title="Pending Payments" value={`₱${pendingInvoiceAmount.toLocaleString()}`} change={`${pendingInvoices.length} invoices pending`} changeType="negative" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
          <h3 className="mb-6 text-lg font-semibold text-card-foreground">Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(220 13% 91%)', fontSize: 13 }} />
              <Bar dataKey="active" fill="hsl(217 91% 50%)" radius={[4, 4, 0, 0]} name="Active" />
              <Bar dataKey="completed" fill="hsl(162 63% 41%)" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="onHold" fill="hsl(43 96% 56%)" radius={[4, 4, 0, 0]} name="On Hold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
          <h3 className="mb-6 text-lg font-semibold text-card-foreground">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 hover:bg-background/50 transition-colors duration-200">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{project.client || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border/50 bg-card p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in">
        <h3 className="mb-6 text-lg font-semibold text-card-foreground">Upcoming Deadlines</h3>
        <div className="space-y-3">
          {upcomingDeadlines.map((project) => (
            <div key={project.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/30 p-4 hover:bg-background/50 transition-colors duration-200">
              <div>
                <p className="text-sm font-semibold text-card-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{project.client || 'N/A'}</p>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{project.deadline}</p>
            </div>
          ))}
          {upcomingDeadlines.length === 0 && <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>}
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-base text-muted-foreground mt-2">Here's what's happening with your projects today.</p>
      </div>
      <DashboardContent />
    </DashboardLayout>
  );
};

export default Dashboard;
