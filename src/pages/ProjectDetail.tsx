import { ReactNode, useState, useEffect, useRef } from 'react';
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
import { formatDate } from '@/lib/utils';

import { Overview } from '@/components/projects/Overview';
import TeamMembers from '@/components/projects/TeamMembers';
import Tasks from '@/components/projects/Tasks';
import Files from '@/components/projects/Files';
import Chat from '@/components/projects/Chat';
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
  { key: 'tasks', label: 'Kanban Tasks', icon: FolderKanban },
  { key: 'files', label: 'Files & Blueprints', icon: FileText },
  { key: 'chat', label: 'Project Chat', icon: MessageSquare },
  { key: 'design', label: 'Design Assistant', icon: Wand2 },
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
  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `design-${Date.now()}.png`;
    link.click();
  };

  // --- Image Generations State ---
  const { data: imagesData } = useProjectImages(id || '', 1);
  const images = imagesData?.data || [];

  const TAB_COMPONENTS: Record<string, ReactNode> = {
    overview: <Overview project={project} projectId={id} />,
    team: <TeamMembers projectId={id} />,
    tasks: <Tasks projectId={id} />,
    files: <Files projectId={id} />,
    chat: <Chat projectId={id} />,
    design: (
      <div className="flex flex-col h-[60vh]">
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4 mb-3 sm:mb-4">
                <Wand2 className="h-8 sm:h-12 w-8 sm:w-12 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Design Assistant</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4 sm:mb-6">
                Describe your architectural design ideas and I'll generate stunning visualizations powered by AI.
              </p>
              <div className="bg-card border border-border rounded-lg p-3 max-w-md w-full mb-4 sm:mb-6">
                {id ? (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    Project selected
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-warning">
                    <AlertCircle className="h-4 w-4" />
                    Project not loaded
                  </div>
                )}
              </div>
              <div className="bg-card border border-border rounded-lg p-3 sm:p-4 max-w-md text-left text-pretty">
                <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Try asking:</p>
                <p className="text-xs sm:text-sm text-muted-foreground">"Generate a modern 5-story office building with green spaces and glass façade"</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.image ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-full sm:max-w-2xl ${msg.image ? 'bg-primary/90 text-primary-foreground' : 'bg-card border border-border'} rounded-lg p-3 sm:p-4 break-words`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">{msg.text}</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        {msg.image && (
                          <div className="mt-3">
                            <img
                              src={`${import.meta.env.VITE_APP_BASE_URL}${msg.image}`}
                              alt="Generated design"
                              className="w-full rounded-lg border border-primary/20"
                            />
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="mt-2 gap-2 text-xs"
                              onClick={() => handleDownload(`${import.meta.env.VITE_APP_BASE_URL}${msg.image}`)}
                            >
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 sm:p-6 border-t border-border bg-background">
          <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
            <div className="flex-1">
              <Textarea
                placeholder="Describe your design idea... (Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={designIsLoading || !id}
                rows={3}
                className="resize-none text-sm"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={designIsLoading || !input.trim() || !id}
              className="gap-2 h-10 sm:h-fit w-full sm:w-auto"
              title={!id ? 'Project not loaded' : ''}
            >
              {designIsLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sm:hidden">Generating...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="sm:hidden">Send</span>
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            AI Design Assistant • Powered by OpenAI DALL-E
          </p>
        </div>
      </div>
    ),
    images: (
      <div className="p-3 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Image Generations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No images found for this project.</div>
          )}
          {images.map((img) => (
            <div key={img.id} className="bg-card border border-border rounded-lg p-3 flex flex-col items-center">
              <img src={`${import.meta.env.VITE_APP_BASE_URL}${img.url}`} alt={img.prompt} className="w-full rounded mb-2 border" />
              <div className="text-xs text-muted-foreground mb-1 truncate w-full">{img.prompt}</div>
              <Button size="sm" variant="ghost" onClick={() => {
                const link = document.createElement('a');
                link.href = `${import.meta.env.VITE_APP_BASE_URL}${img.url}`;
                link.download = `design-${img.id}.png`;
                link.click();
              }}>Download</Button>
            </div>
          ))}
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
      <div className="mb-6">
        <button onClick={() => navigate('/projects')} className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </button>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.clients && project.clients.length > 0 ? project.clients.map(c => c.name).join(', ') : 'No client'} · Deadline: {formatDate(project.deadline)}</p>
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
