import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjectStore, selectProjectById } from '@/stores/project.store';
import { useTaskStore } from '@/stores/task.store';
import { useTeamStore } from '@/stores/team.store';
import { ArrowLeft, Users, FolderKanban, FileText, MessageSquare, Upload, Calendar, BarChart3, Brain } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const tabs = [
  { key: 'overview', label: 'Overview', icon: FolderKanban },
  { key: 'team', label: 'Team Members', icon: Users },
  { key: 'tasks', label: 'Kanban Tasks', icon: FolderKanban },
  { key: 'files', label: 'Files & Blueprints', icon: FileText },
  { key: 'chat', label: 'Project Chat', icon: MessageSquare },
];

const quickActions = [
  { label: 'Upload Blueprint', icon: Upload, dialogTitle: 'Upload Blueprint', dialogDesc: 'Upload architectural blueprints and design files.' },
  { label: 'Schedule Meeting', icon: Calendar, dialogTitle: 'Schedule Meeting', dialogDesc: 'Schedule a meeting with your project team.' },
  { label: 'Generate Report', icon: BarChart3, dialogTitle: 'Generate Project Report', dialogDesc: 'Create a detailed progress report for this project.' },
  { label: 'AI Analysis', icon: Brain, dialogTitle: 'AI Project Analysis', dialogDesc: 'Run AI-powered analysis on project data and progress.' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAction, setActiveAction] = useState<typeof quickActions[0] | null>(null);
  const { toast } = useToast();
  const project = useProjectStore(selectProjectById(id || ''));
  const tasks = useTaskStore((s) => s.tasks);
  const members = useTeamStore((s) => s.members);

  if (!project) return (
    <DashboardLayout>
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    </DashboardLayout>
  );

  const handleActionSubmit = () => {
    const name = activeAction?.label;
    setActiveAction(null);
    toast({ title: `${name} Complete`, description: `${name} action completed successfully.` });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button onClick={() => navigate('/projects')} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">{project.client} · Deadline: {project.deadline}</p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
              <h3 className="text-base font-semibold text-card-foreground mb-4">Project Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Overall Completion</span>
                  <span className="font-semibold text-foreground">{project.progress}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <div className="h-3 rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="rounded-md border border-border p-4">
                  <p className="text-xs text-muted-foreground">Budget</p>
                  <p className="text-xl font-bold text-foreground">₱{(project.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <p className="text-xs text-muted-foreground">Team Size</p>
                  <p className="text-xl font-bold text-foreground">5 Members</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => setActiveAction(action)}
                    className="w-full flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map(m => (
              <div key={m.name} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-3 gap-4">
            {(['todo', 'in-progress', 'done'] as const).map(col => (
              <div key={col}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {col === 'todo' ? 'To Do' : col === 'in-progress' ? 'In Progress' : 'Done'}
                </h4>
                <div className="space-y-2">
                  {tasks.filter(t => t.status === col).map(t => (
                    <div key={t.id} className="rounded-md border border-border bg-card p-3">
                      <p className="text-sm font-medium text-card-foreground">{t.title}</p>
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
        )}

        {activeTab === 'files' && (
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors"
               onClick={() => setActiveAction(quickActions[0])}>
            <div className="text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Supports blueprints, CAD files, and documents</p>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex h-48 items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Project chat will appear here</p>
                <p className="text-xs text-muted-foreground mt-1">Start a conversation with your team</p>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-4 flex gap-2">
              <input placeholder="Type a message..." className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
              <Button onClick={() => toast({ title: 'Message Sent', description: 'Your message has been sent to the project chat.' })}>Send</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeAction && <activeAction.icon className="h-5 w-5 text-primary" />}
              {activeAction?.dialogTitle}
            </DialogTitle>
            <DialogDescription>{activeAction?.dialogDesc}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {activeAction?.label === 'Upload Blueprint' && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 cursor-pointer hover:border-primary/40 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">DWG, PDF, PNG up to 50MB</p>
              </div>
            )}
            {activeAction?.label === 'Schedule Meeting' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Meeting Title</label>
                  <input placeholder="e.g. Design Review" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Date</label>
                    <input type="date" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Time</label>
                    <input type="time" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                  </div>
                </div>
              </div>
            )}
            {activeAction?.label === 'Generate Report' && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Report Type</label>
                  <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                    <option>Progress Report</option>
                    <option>Financial Summary</option>
                    <option>Team Performance</option>
                    <option>Full Project Report</option>
                  </select>
                </div>
              </div>
            )}
            {activeAction?.label === 'AI Analysis' && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-foreground">AI will analyze the following for <strong>{project.name}</strong>:</p>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc pl-4">
                    <li>Timeline and deadline risks</li>
                    <li>Budget utilization patterns</li>
                    <li>Team workload distribution</li>
                    <li>Milestone completion forecast</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveAction(null)}>Cancel</Button>
            <Button onClick={handleActionSubmit}>{activeAction?.label}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProjectDetail;
