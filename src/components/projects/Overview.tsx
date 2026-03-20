import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types'
import { BarChart3, Calendar, Upload } from 'lucide-react';
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

    const handleActionSubmit = () => {
        const name = activeAction?.label;
        setActiveAction(null);
        toast({ title: `${name} Complete`, description: `${name} action completed successfully.` });
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 lg:col-span-2 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-1 w-8 rounded-full bg-primary"></div>
                        <h3 className="text-lg font-bold text-primary">Project Progress</h3>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-foreground font-medium">Overall Completion</span>
                            <span className="font-bold text-primary text-base">{project.progress}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-muted/40">
                            <div className="h-3 rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all shadow-sm" style={{ width: `${project.progress}%` }} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="rounded-lg border border-primary/20 bg-white p-4">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Budget</p>
                            <p className="text-2xl font-bold text-primary">₱{Number(project.budget || 0).toLocaleString()}</p>
                        </div>
                        <div className="rounded-lg border border-success/20 bg-white p-4">
                            <p className="text-xs font-bold text-success uppercase tracking-wider mb-2">Team Size</p>
                            <p className="text-2xl font-bold text-success">{teamCount} {teamCount === 1 ? 'Member' : 'Members'}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm">
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
                                <button
                                    key={action.label}
                                    onClick={() => setActiveAction(action)}
                                    className={`w-full flex items-center gap-3 rounded-lg ${bgColors[idx]} border border-current/20 px-4 py-3 text-sm font-semibold ${textColors[idx]} hover:shadow-md hover:scale-105 transition-all duration-200 text-left`}
                                >
                                    <div className={`h-8 w-8 rounded-md bg-gradient-to-br ${colors[idx]} from-current/20 to-transparent flex items-center justify-center`}>
                                        <action.icon className="h-4 w-4" />
                                    </div>
                                    <span>{action.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

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
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-12 cursor-pointer hover:border-primary/60 hover:shadow-md transition-all">
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-base font-semibold text-foreground">Click to upload or drag & drop</p>
                                <p className="text-sm text-muted-foreground mt-2">DWG, PDF, PNG up to 50MB</p>
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
