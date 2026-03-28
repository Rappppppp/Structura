import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types'
import { BarChart3, Calendar, Upload, Info, Clock, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
// Confetti animation (simple SVG burst)
const Confetti = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in z-50">
        <svg width="180" height="80" viewBox="0 0 180 80" fill="none">
            <g>
                <circle cx="30" cy="40" r="6" fill="#facc15"/>
                <circle cx="60" cy="20" r="4" fill="#34d399"/>
                <circle cx="90" cy="60" r="5" fill="#60a5fa"/>
                <circle cx="120" cy="30" r="4" fill="#f472b6"/>
                <circle cx="150" cy="50" r="6" fill="#f87171"/>
            </g>
        </svg>
    </div>
);
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuickAction } from '@/types/quickaction';
import { useQuickActionStore } from '@/stores/project.detailed.quickaction.store';
import { useProjectTeam } from '@/hooks/queries/useProjectTeam';

interface OverviewProps {
    project: Project;
    projectId?: string;
}

export const quickActions: QuickAction[] = [
    { label: 'Upload Blueprint', icon: Upload, dialogTitle: 'Upload Blueprint', dialogDesc: 'Upload architectural blueprints and design files.' },
    { label: 'Schedule Meeting', icon: Calendar, dialogTitle: 'Schedule Meeting', dialogDesc: 'Schedule a meeting with your project team.' },
    { label: 'Generate Report', icon: BarChart3, dialogTitle: 'Generate Project Report', dialogDesc: 'Create a detailed progress report for this project.' },
    // { label: 'AI Analysis', icon: Brain, dialogTitle: 'AI Project Analysis', dialogDesc: 'Run AI-powered analysis on project data and progress.' },
];

export const Overview = ({ project, projectId }: OverviewProps) => {
    

        const { activeAction, setActiveAction } = useQuickActionStore();
        const { toast } = useToast();
        const { data: teamData } = useProjectTeam(projectId);
        const teamCount = teamData?.data?.length || 0;
        const [showConfetti, setShowConfetti] = useState(false);
        const [dragActive, setDragActive] = useState(false);
        type TimelineItem = {
            icon: any;
            label: string;
            date: string;
            color?: string;
            status?: string;
        };
        const timeline: TimelineItem[] = [
            { icon: Clock, label: 'Project Created', date: project.created_at || '' },
            { icon: BarChart3, label: 'Last Updated', date: project.updated_at || '' },
            { icon: CheckCircle, label: 'Status', date: '', color: project.status === 'completed' ? 'text-success' : 'text-primary', status: project.status },
        ];

        useEffect(() => {
            if (project.progress === 100 && project.status === 'completed') {
                setShowConfetti(true);
                const t = setTimeout(() => setShowConfetti(false), 2000);
                return () => clearTimeout(t);
            }
        }, [project.progress, project.status]);

        const handleActionSubmit = () => {
                const name = activeAction?.label;
                setActiveAction(null);
                toast({ title: `${name} Complete`, description: `${name} action completed successfully.` });
        };

    return (
        <>
            {showConfetti && <Confetti />}
            {/* Modern Project Header Card */}
            {/* <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-white/80 to-90% p-8 mb-8 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in-up">
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 truncate">{project.name}</h1>
                    <p className="text-base md:text-lg text-muted-foreground mb-2 max-w-2xl truncate">{project.description || 'No description provided.'}</p>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            <Clock className="h-4 w-4" /> Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                            <CheckCircle className="h-4 w-4" /> Status: <span className="ml-1 capitalize">{project.status}</span>
                        </span>
                        {project.clients && project.clients.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted/60 text-foreground text-xs font-semibold">
                                <Info className="h-4 w-4" />
                                {project.clients.map(c => c.name).join(', ')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-3 min-w-[220px]">
                    <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4 flex flex-col items-center">
                        <span className="text-xs font-bold text-primary uppercase mb-1 tracking-wider">Budget</span>
                        <span className="text-2xl font-extrabold text-primary">₱{Number(project.budget || 0).toLocaleString()}</span>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 p-4 flex flex-col items-center">
                        <span className="text-xs font-bold text-success uppercase mb-1 tracking-wider">Team Size</span>
                        <span className="text-2xl font-extrabold text-success">{teamCount} {teamCount === 1 ? 'Member' : 'Members'}</span>
                    </div>
                </div>
            </div> */}

            {/* Progress, Timeline, and Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Progress & Timeline */}
                <div className="md:col-span-2 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-1 w-8 rounded-full bg-primary"></div>
                        <h3 className="text-lg font-bold text-primary">Project Progress</h3>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-foreground font-medium">Overall Completion</span>
                            <span className="font-bold text-primary text-base">{project.progress}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-muted/40 overflow-hidden animate-grow">
                            <div className="h-3 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all shadow-sm" style={{ width: `${project.progress}%` }} />
                        </div>
                        {project.progress === 100 && project.status !== 'completed' && (
                            <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/30 animate-fade-in">
                                <p className="text-sm font-semibold text-success">🎉 Project Ready to Complete!</p>
                                <p className="text-xs text-success/80">All work is done. Click the status badge to mark as completed.</p>
                            </div>
                        )}
                        {project.status === 'completed' && (
                            <div className="mt-3 p-3 rounded-lg bg-success/10 border border-success/30 animate-fade-in">
                                <p className="text-sm font-semibold text-success">✓ Project Completed</p>
                            </div>
                        )}
                    </div>
                    {/* Timeline section */}
                    <div className="mt-8">
                        <h4 className="text-base font-semibold mb-2 text-primary">Timeline</h4>
                        <ol className="relative border-primary/20 ml-2">
                            {timeline.map((item, idx) => (
                                <li key={idx} className="mb-4 ml-4 animate-fade-in-up">
                                    <span className={`absolute -left-5 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ${item.color || 'text-primary'}`}> 
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground text-sm">{item.label}</span>
                                        {item.label === 'Status' ? (
                                            <span className="text-xs text-muted-foreground capitalize">{item.status}</span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">{item.date ? new Date(item.date).toLocaleString() : ''}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
                {/* Quick Actions */}
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-1 w-8 rounded-full bg-primary"></div>
                        <h3 className="text-lg font-bold text-primary">Quick Actions</h3>
                    </div>
                    <div className="space-y-2">
                        {quickActions.map((action, idx) => {
                            const colors = ['from-primary', 'from-success', 'from-warning'];
                            const bgColors = ['bg-primary/10', 'bg-success/10', 'bg-warning/10'];
                            const textColors = ['text-primary', 'text-success', 'text-warning'];
                            return (
                                <div key={action.label} className="flex gap-2 items-center">
                                    <button
                                        onClick={() => setActiveAction(action)}
                                        className={`w-full flex items-center gap-3 rounded-lg ${bgColors[idx]} border border-current/20 px-4 py-3 text-sm font-semibold ${textColors[idx]} hover:shadow-md hover:scale-105 transition-all duration-200 text-left animate-fade-in-up`}
                                    >
                                        <div className={`h-8 w-8 rounded-md bg-gradient-to-br ${colors[idx]} from-current/20 to-transparent flex items-center justify-center`}>
                                            <action.icon className="h-4 w-4" />
                                        </div>
                                        <span>{action.label}</span>
                                    </button>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" variant="ghost" className="hover:bg-muted/50">
                                                <Info className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">View details for {action.label}</TooltipContent>
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Dialog for Quick Actions */}
            <Dialog open={!!activeAction} onOpenChange={(open) => !open && setActiveAction(null)}>
                <DialogContent className="border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-2xl">
                            {activeAction && <activeAction.icon className="h-6 w-6 text-primary" />}
                            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{activeAction?.dialogTitle}</span>
                        </DialogTitle>
                        <DialogDescription className="text-base text-foreground">{activeAction?.dialogDesc}</DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        {activeAction?.label === 'Upload Blueprint' && (
                            <div
                                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-12 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all relative ${dragActive ? 'border-success/60 bg-success/10' : ''}`}
                                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                                onDrop={e => { e.preventDefault(); setDragActive(false); toast({ title: 'File uploaded!', description: e.dataTransfer.files[0]?.name }); }}
                            >
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4 animate-fade-in">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-base font-semibold text-foreground">Click to upload or drag & drop</p>
                                <p className="text-sm text-muted-foreground mt-2">DWG, PDF, PNG up to 50MB</p>
                                {dragActive && <span className="absolute inset-0 flex items-center justify-center text-success font-bold text-lg animate-pulse">Drop to upload!</span>}
                            </div>
                        )}
                        {activeAction?.label === 'Schedule Meeting' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-foreground">Meeting Title</label>
                                    <input placeholder="e.g. Design Review" className="h-11 w-full rounded-lg border border-primary/20 bg-white px-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-foreground">Date</label>
                                        <input type="date" className="h-11 w-full rounded-lg border border-primary/20 bg-white px-4 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-bold text-foreground">Time</label>
                                        <input type="time" className="h-11 w-full rounded-lg border border-primary/20 bg-white px-4 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all" />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeAction?.label === 'Generate Report' && (
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-foreground">Report Type</label>
                                    <select className="h-11 w-full rounded-lg border border-primary/20 bg-white px-4 text-base font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all cursor-pointer">
                                        <option>Progress Report</option>
                                        <option>Financial Summary</option>
                                        <option>Team Performance</option>
                                        <option>Full Project Report</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="gap-3">
                        <Button variant="outline" onClick={() => setActiveAction(null)} className="border-border/50 hover:bg-muted/30">Cancel</Button>
                        <Button onClick={handleActionSubmit} className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-105 transition-all">{activeAction?.label}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
