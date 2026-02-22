import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types'
import { BarChart3, Calendar, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QuickAction } from '@/types/quickaction';
import { useQuickActionStore } from '@/stores/project.detailed.quickaction.store';

interface OverviewProps {
    project: Project;
}

export const quickActions: QuickAction[] = [
    { label: 'Upload Blueprint', icon: Upload, dialogTitle: 'Upload Blueprint', dialogDesc: 'Upload architectural blueprints and design files.' },
    { label: 'Schedule Meeting', icon: Calendar, dialogTitle: 'Schedule Meeting', dialogDesc: 'Schedule a meeting with your project team.' },
    { label: 'Generate Report', icon: BarChart3, dialogTitle: 'Generate Project Report', dialogDesc: 'Create a detailed progress report for this project.' },
    // { label: 'AI Analysis', icon: Brain, dialogTitle: 'AI Project Analysis', dialogDesc: 'Run AI-powered analysis on project data and progress.' },
];

export const Overview = ({ project }: OverviewProps) => {
    
    const { activeAction, setActiveAction } = useQuickActionStore();
    const { toast } = useToast();

    const handleActionSubmit = () => {
        const name = activeAction?.label;
        setActiveAction(null);
        toast({ title: `${name} Complete`, description: `${name} action completed successfully.` });
    };

    return (
        <>
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActiveAction(null)}>Cancel</Button>
                        <Button onClick={handleActionSubmit}>{activeAction?.label}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
