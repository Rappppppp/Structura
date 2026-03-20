import { ReactNode, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProject } from '@/hooks/queries/useProjects';
import { useUpdateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, FolderKanban, FileText, MessageSquare, Cuboid, Pyramid, Check, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectStatus } from '@/types';

import { Overview } from '@/components/projects/Overview';
import TeamMembers from '@/components/projects/TeamMembers';
import Tasks from '@/components/projects/Tasks';
import Files from '@/components/projects/Files';
import Chat from '@/components/projects/Chat';

const tabs = [
  { key: 'overview', label: 'Overview', icon: FolderKanban },
  { key: 'structural', label: 'Structural', icon: Cuboid },
  { key: 'architectural', label: 'Architectural', icon: Pyramid },
  { key: 'team', label: 'Team Members', icon: Users },
  { key: 'tasks', label: 'Kanban Tasks', icon: FolderKanban },
  { key: 'files', label: 'Files & Blueprints', icon: FileText },
  { key: 'chat', label: 'Project Chat', icon: MessageSquare },
];

const statusOptions: { value: ProjectStatus; label: string; icon: any; color: string }[] = [
  { value: 'active', label: 'Active', icon: Clock, color: 'text-blue-600' },
  { value: 'review', label: 'In Review', icon: AlertCircle, color: 'text-yellow-600' },
  { value: 'completed', label: 'Completed', icon: Check, color: 'text-green-600' },
  { value: 'on-hold', label: 'On Hold', icon: Clock, color: 'text-orange-600' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { data: projectData, isLoading, error } = useProject(id || '');
  const project = projectData?.data;
  const updateProject = useUpdateProjectMutation();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!id) return;
    
    try {
      await updateProject.mutateAsync({
        id,
        data: { status: newStatus },
      });
      toast({
        title: 'Status updated',
        description: `Project status changed to ${statusOptions.find(s => s.value === newStatus)?.label}`,
      });
      setStatusDialogOpen(false);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update project status',
        variant: 'destructive',
      });
    }
  };

  const handleAutoComplete = async () => {
    if (!id || project?.progress !== 100) return;
    
    try {
      await updateProject.mutateAsync({
        id,
        data: { status: 'completed' },
      });
      toast({
        title: 'Project completed! 🎉',
        description: 'Project automatically marked as completed',
      });
    } catch (err: any) {
      console.error('Failed to auto-complete project:', err);
    }
  };

  // Auto-complete project when progress reaches 100%
  useEffect(() => {
    if (project?.progress === 100 && project?.status !== 'completed') {
      handleAutoComplete();
    }
  }, [project?.progress, project?.status, id]);

  const TAB_COMPONENTS: Record<string, ReactNode> = {
    overview: <Overview project={project} projectId={id} />,
    team: <TeamMembers projectId={id} />,
    tasks: <Tasks projectId={id} />,
    files: <Files projectId={id} />,
    chat: <Chat projectId={id} />,
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    </DashboardLayout>
  );

  if (error || !project) return (
    <DashboardLayout>
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Project not found.</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button onClick={() => navigate('/projects')} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.client} · Deadline: {project.deadline}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Button
              onClick={() => setStatusDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Change Status
            </Button>
            {project.progress === 100 && project.status !== 'completed' && (
              <Button
                onClick={handleAutoComplete}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Complete Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Project Status</DialogTitle>
            <DialogDescription>Select a new status for this project</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  project?.status === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary hover:bg-muted/50'
                }`}
              >
                <option.icon className={`h-5 w-5 ${option.color}`} />
                <span className="font-medium">{option.label}</span>
                {project?.status === option.value && (
                  <Check className="h-4 w-4 ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {TAB_COMPONENTS[activeTab]}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
