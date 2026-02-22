import { useTaskStore } from '@/stores/task.store';
import React from 'react'

const Tasks = () => {
    const tasks = useTaskStore((s) => s.tasks);

    return (
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
    )
}

export default Tasks