import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjectStore } from '@/stores/project.store';
import { useTaskStore } from '@/stores/task.store';
import { useCommunicationStore } from '@/stores/communication.store';
import {
  FolderKanban, Clock, MessageSquare, CreditCard, TrendingUp,
  CheckCircle2, AlertCircle, Brain
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const projects = useProjectStore((s) => s.projects);
  const statusData = useProjectStore((s) => s.statusData);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderKanban} title="Active Projects" value={4} change="+2 this month" changeType="positive" />
        <StatCard icon={Clock} title="Upcoming Deadlines" value={3} change="Next: Mar 20" changeType="neutral" />
        <StatCard icon={MessageSquare} title="Unread Messages" value={9} change="+5 today" changeType="negative" />
        <StatCard icon={CreditCard} title="Pending Payments" value="₱2.02M" change="2 invoices due" changeType="neutral" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">Project Status Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(220 13% 91%)', fontSize: 13 }} />
              <Bar dataKey="active" fill="hsl(217 91% 50%)" radius={[4,4,0,0]} name="Active" />
              <Bar dataKey="completed" fill="hsl(162 63% 41%)" radius={[4,4,0,0]} name="Completed" />
              <Bar dataKey="onHold" fill="hsl(43 96% 56%)" radius={[4,4,0,0]} name="On Hold" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.client}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const ArchitectDashboard = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const { toast } = useToast();
  const tasks = useTaskStore((s) => s.tasks);
  const columns = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' } as const;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FolderKanban} title="My Projects" value={3} change="2 active" changeType="positive" />
        <StatCard icon={CheckCircle2} title="Tasks Completed" value={12} change="This week" changeType="positive" />
        <StatCard icon={AlertCircle} title="Pending Reviews" value={4} change="2 urgent" changeType="negative" />
        <StatCard icon={TrendingUp} title="Design Uploads" value={28} change="+6 this week" changeType="positive" />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-6 animate-fade-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-card-foreground">Task Board</h3>
          <Button variant="ghost" className="text-primary" onClick={() => setAiOpen(true)}>
            <Brain className="h-4 w-4" /> AI Design Assistant
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(columns) as [string, string][]).map(([key, label]) => (
            <div key={key}>
              <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</h4>
              <div className="space-y-2">
                {tasks.filter(t => t.status === key).map(t => (
                  <div key={t.id} className="rounded-md border border-border bg-background p-3">
                    <p className="text-sm font-medium text-foreground">{t.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-medium ${t.priority === 'high' ? 'text-destructive' : t.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'}`}>
                        {t.priority}
                      </span>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{t.assignee}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Design Assistant</DialogTitle>
            <DialogDescription>Get AI-powered design suggestions and feedback on your architectural concepts.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Describe your design concept</label>
              <textarea rows={4} placeholder="e.g. A modern mixed-use building with sustainable features..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Style Preference</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>Modernist</option>
                <option>Minimalist</option>
                <option>Brutalist</option>
                <option>Neo-classical</option>
                <option>Sustainable / Green</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAiOpen(false); toast({ title: 'AI Processing', description: 'Generating design suggestions...' }); }}>
              <Brain className="h-4 w-4" /> Generate Suggestions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ClientDashboard = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { toast } = useToast();
  const timelineEvents = useCommunicationStore((s) => s.timelineEvents);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={FolderKanban} title="Active Projects" value={2} change="On track" changeType="positive" />
        <StatCard icon={CreditCard} title="Total Invested" value="₱5.2M" change="2 pending invoices" changeType="neutral" />
        <StatCard icon={MessageSquare} title="Messages" value={4} change="1 unread" changeType="neutral" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">Project Timeline</h3>
          <div className="relative space-y-0">
            {timelineEvents.map((ev, i) => (
              <div key={i} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full border-2 border-primary bg-card" />
                  {i < timelineEvents.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                </div>
                <div className="-mt-0.5">
                  <p className="text-xs font-medium text-muted-foreground">{ev.date}</p>
                  <p className="text-sm font-semibold text-card-foreground">{ev.title}</p>
                  <p className="text-sm text-muted-foreground">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">AI Virtual Assistant</h3>
          <div className="flex h-52 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border">
            <Brain className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-muted-foreground">AI Assistant Ready</p>
            <p className="text-xs text-muted-foreground mt-1">Ask questions about your project</p>
            <Button className="mt-4" onClick={() => setChatOpen(true)}>Start Chat</Button>
          </div>
        </div>
      </div>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AI Virtual Assistant</DialogTitle>
            <DialogDescription>Ask questions about your project status, payments, or timeline.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 mb-4">
              <p className="text-sm text-foreground">Hello! I'm your project assistant. How can I help you today?</p>
              <p className="text-xs text-muted-foreground mt-1">AI Assistant</p>
            </div>
            <div className="flex gap-2">
              <input placeholder="Type your question..." className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              <Button onClick={() => toast({ title: 'Message Sent', description: 'AI is processing your question...' })}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening with your projects today.</p>
      </div>
      {role === 'admin' && <AdminDashboard />}
      {(role === 'architect' || role === 'engineer') && <ArchitectDashboard />}
      {role === 'client' && <ClientDashboard />}
    </DashboardLayout>
  );
};

export default Dashboard;
