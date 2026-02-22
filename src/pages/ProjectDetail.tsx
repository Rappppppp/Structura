import { ReactNode, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/shared/StatusBadge';
import { useProjectStore, selectProjectById } from '@/stores/project.store';
import { ArrowLeft, Users, FolderKanban, FileText, MessageSquare, Cuboid, Pyramid } from 'lucide-react';

import { useQuickActionStore } from '@/stores/project.detailed.quickaction.store';
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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const project = useProjectStore(selectProjectById(id || ''));

  const TAB_COMPONENTS: Record<string, ReactNode> = {
    overview: <Overview project={project} />,
    team: <TeamMembers />,
    tasks: <Tasks />,
    files: <Files />,
    chat: <Chat />,
  };

  const { setActiveAction } = useQuickActionStore();

  if (!project) return (
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
