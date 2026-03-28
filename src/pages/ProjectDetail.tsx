import { ReactNode, useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '@/hooks/queries/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProject } from '@/hooks/queries/useProjects';
import { useUpdateProjectMutation } from '@/hooks/mutations/useProjectMutations';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, FolderKanban, FileText, MessageSquare, Cuboid, Pyramid, Check, XCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectStatus } from '@/types';
import { formatDate } from '@/lib/utils';

import { Overview } from '@/components/projects/Overview';
import TeamMembers from '@/components/projects/TeamMembers';
import Tasks from '@/components/projects/Tasks';
import Files from '@/components/projects/Files';
import Chat from '@/components/projects/Chat';
import { useTasks } from '@/hooks/queries/useTasks';
import { Wand2, Send, Loader2, Plus, Download } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useProjectImages, useGenerateImage } from '@/hooks/mutations/useImageGeneration';
import { imageGenerationService } from '@/api/imageGeneration.service';
import { formatTime } from '@/lib/utils';

const tabs = [
  { key: 'overview', label: 'Overview', icon: FolderKanban },
  { key: 'structural', label: 'Structural', icon: Cuboid },
  { key: 'architectural', label: 'Architectural', icon: Pyramid },
  { key: 'team', label: 'Team Members', icon: Users },
  // { key: 'tasks', label: 'Kanban Tasks', icon: FolderKanban },
  { key: 'files', label: 'Files & Blueprints', icon: FileText },
  { key: 'chat', label: 'Project Chat', icon: MessageSquare },
  ...(typeof window !== 'undefined' && window.__CURRENT_USER_ROLE === 'client' ? [] : [{ key: 'design', label: 'Design Assistant', icon: Wand2 }]),
  { key: 'images', label: 'Image Generations', icon: FileText },
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
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.data?.user;

  // Remove Design Assistant tab for client users
  const filteredTabs = currentUser?.role === 'client'
    ? tabs.filter(tab => tab.key !== 'design')
    : tabs;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { data: projectData, isLoading: projectLoading, error } = useProject(id || '');
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


  // --- Design Assistant State ---
  interface Message {
    id: string;
    text: string;
    image?: string;
    imageId?: string;
    isLoading?: boolean;
    timestamp: Date;
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [designIsLoading, setDesignIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: saveImage } = useGenerateImage(id || '');
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const handleNewChat = () => { setMessages([]); setInput(''); };
  const handleSendMessage = async () => {
    if (!input.trim()) {
      toast({ title: 'Error', description: 'Please enter a design prompt', variant: 'destructive' });
      return;
    }
    if (!id) {
      toast({ title: 'Error', description: 'Project not loaded', variant: 'destructive' });
      return;
    }
    const userMessage: Message = { id: Date.now().toString(), text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const prompt = input;
    setInput('');
    setDesignIsLoading(true);
    const loadingId = Date.now().toString();
    setMessages(prev => [...prev, { id: loadingId, text: 'Generating your design with AI...', isLoading: true, timestamp: new Date() }]);
    try {
      const savedImage = await imageGenerationService.generateWithOpenAI(id, prompt);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Generated design: "${prompt}"`,
        image: savedImage.url,
        imageId: savedImage.id,
        timestamp: new Date()
      };
      setMessages(prev => prev.filter(m => m.id !== loadingId).concat(aiMessage));
      toast({ title: 'Success', description: 'Design generated and saved successfully!' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate design. Please try again.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      setMessages(prev => prev.filter(m => m.id !== loadingId));
    } finally {
      setDesignIsLoading(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  // --- Image Generations State ---
  const { data: imagesData } = useProjectImages(id || '', 1);
  const images = imagesData?.data || [];

  // Fetch all tasks for this project (reactive)
  const { data: tasksData } = useTasks(id);
  const allTasks = tasksData?.data || [];
  const structuralTasks = allTasks.filter((t: any) => t.category === 'structural');
  const architecturalTasks = allTasks.filter((t: any) => t.category === 'architectural');

  const renderTaskList = (tasks: any[]) => (
    <div className="overflow-x-auto rounded-lg border border-border mb-6">
      <table className="min-w-full divide-y divide-border text-xs">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left font-semibold">Title</th>
            <th className="px-3 py-2 text-left font-semibold">Status</th>
            <th className="px-3 py-2 text-left font-semibold">Assignee</th>
            <th className="px-3 py-2 text-left font-semibold">Due</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr><td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">No tasks found.</td></tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-3 py-2 font-medium">{task.title}</td>
                <td className="px-3 py-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${task.status === 'done' ? 'bg-green-100 text-green-700' : task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>{task.status.replace('-', ' ').toUpperCase()}</span>
                </td>
                <td className="px-3 py-2">{task.assignee || 'Unassigned'}</td>
                <td className="px-3 py-2">{task.dueAt ? new Date(task.dueAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const TAB_COMPONENTS: Record<string, ReactNode> = {
    overview: <Overview project={project} projectId={id} />, 
    team: <TeamMembers projectId={id} />, 
    structural: (
      <div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Cuboid className="h-4 w-4" /> Structural Tasks</h3>
        {renderTaskList(structuralTasks)}
        {currentUser?.role !== 'client' && <Tasks projectId={id} />}
      </div>
    ),
    architectural: (
      <div>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Pyramid className="h-4 w-4" /> Architectural Tasks</h3>
        {renderTaskList(architecturalTasks)}
        {currentUser?.role !== 'client' && <Tasks projectId={id} />}
      </div>
    ),
    tasks: <Tasks projectId={id} />, 
    files: <Files projectId={id} />, 
    chat: <Chat projectId={id} />, 
    design: (
      <div className="flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-0 sm:p-0">
          <div className="max-w-2xl mx-auto w-full h-full flex flex-col justify-center">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Wand2 className="h-10 w-10 sm:h-14 sm:w-14 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-2">AI Design Assistant</h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-6">
                  Describe your architectural design ideas and AI will generate stunning visualizations.
                </p>
                <div className="bg-card border border-border rounded-xl p-4 max-w-lg w-full mb-6">
                  {id ? (
                    <div className="flex items-center gap-2 text-base text-success font-semibold">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      Project selected
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-base text-warning font-semibold">
                      <AlertCircle className="h-5 w-5" />
                      Project not loaded
                    </div>
                  )}
                </div>
                <div className="bg-muted/40 border border-border rounded-xl p-4 max-w-lg text-left">
                  <p className="text-sm font-semibold text-foreground mb-2">Try asking:</p>
                  <p className="text-sm text-muted-foreground">"Generate a modern 5-story office building with green spaces and glass façade"</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 py-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.image ? 'justify-end' : 'justify-start'}`}>
                    <div className={`w-full sm:max-w-2xl ${msg.image ? 'bg-primary/90 text-primary-foreground' : 'bg-card border border-border'} rounded-xl p-4 break-words shadow-sm`}>
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-base">{msg.text}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-base whitespace-pre-wrap font-medium">{msg.text}</p>
                          {msg.image && (
                            <div className="mt-4 flex flex-col items-end">
                              <img
                                src={`${import.meta.env.VITE_APP_BASE_URL}${msg.image}`}
                                alt="Generated design"
                                className="w-full rounded-lg border border-primary/20 shadow-md"
                              />
                              <a
                                href={`${import.meta.env.VITE_APP_BASE_URL}${msg.image}`}
                                download={`design-assistant-${msg.imageId || Date.now()}.png`}
                                className="inline-flex items-center gap-2 mt-2 text-xs text-primary hover:underline"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 sm:p-6 border-t border-border bg-background">
          <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row max-w-2xl mx-auto">
            <div className="flex-1">
              <Textarea
                placeholder="Describe your design idea... (Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={designIsLoading || !id}
                rows={3}
                className="resize-none text-base"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={designIsLoading || !input.trim() || !id}
              className="gap-2 h-12 sm:h-fit w-full sm:w-auto text-base font-semibold"
              title={!id ? 'Project not loaded' : ''}
            >
              {designIsLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI Design Assistant • Powered by OpenAI DALL-E
          </p>
        </div>
      </div>
    ),
    images: (
      <div className="p-0 sm:p-0">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-extrabold text-primary mb-6 mt-2 text-center">Image Generations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12 text-lg font-medium">No images found for this project.</div>
            )}
            {images.map((img) => (
              <div key={img.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center shadow-md hover:shadow-lg transition-all">
                <img src={`${import.meta.env.VITE_APP_BASE_URL}${img.url}`} alt={img.prompt} className="w-full rounded-xl mb-3 border shadow-sm" />
                <div className="text-sm text-muted-foreground mb-2 truncate w-full text-center font-medium">{img.prompt}</div>
                {img.generator?.name && (
                  <div className="text-xs text-muted-foreground mb-2 text-center">Generated by: <span className="font-semibold">{img.generator.name}</span></div>
                )}
                <a
                  href={`${import.meta.env.VITE_APP_BASE_URL}${img.url}`}
                  download={`design-${img.id}.png`}
                  className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary/10 text-sm font-semibold transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  };

  if (projectLoading) return (
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
      {/* Modern Project Header Card */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-white/80 to-90% p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <button onClick={() => navigate('/projects')} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 truncate">{project.name}</h1>
          <p className="text-base md:text-lg text-muted-foreground mb-2 max-w-2xl truncate">{project.description || 'No description provided.'}</p>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Clock className="h-4 w-4" /> Deadline: {project.deadline ? formatDate(project.deadline) : 'N/A'}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
              <Check className="h-4 w-4" /> Status: <span className="ml-1 capitalize">{project.status}</span>
            </span>
            {project.clients && project.clients.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted/60 text-foreground text-xs font-semibold">
                <Info className="h-4 w-4" />
                {project.clients.map(c => c.name).join(', ')}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[220px] items-end">
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={project.status} />
            {currentUser?.role !== 'client' && (
              <Button
              onClick={() => setStatusDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Change Status
            </Button>
            )}
            
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
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 flex flex-col items-center w-full">
            <span className="text-xs font-bold text-primary uppercase mb-1 tracking-wider">Budget</span>
            <span className="text-2xl font-extrabold text-primary">₱{Number(project.budget || 0).toLocaleString()}</span>
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
        {filteredTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.key
              ? 'border-primary text-primary'
              : 'border-transparent text-black hover:text-foreground'
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
