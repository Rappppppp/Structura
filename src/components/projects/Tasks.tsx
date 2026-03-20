import { useTasks } from '@/hooks/queries/useTasks';
import { useState } from 'react';
import { useUpdateTaskStatusMutation, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '@/hooks/mutations/useTaskMutations';
import { useToast } from '@/hooks/use-toast';
import { useUsersDropdown } from '@/hooks/queries/useProjectTeam';
import { KanbanTask, TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, AlertCircle, Clock, Search } from 'lucide-react';

interface TasksProps {
    projectId?: string;
}

const COLUMNS: { key: TaskStatus; label: string; color: string; headerColor: string }[] = [
    { key: 'todo', label: 'To Do', color: 'border-slate-300 bg-slate-50/50 dark:bg-slate-900/30', headerColor: 'text-slate-600 dark:text-slate-400' },
    { key: 'in-progress', label: 'In Progress', color: 'border-blue-300 bg-blue-50/50 dark:bg-blue-900/20', headerColor: 'text-blue-600 dark:text-blue-400' },
    { key: 'done', label: 'Done', color: 'border-green-300 bg-green-50/50 dark:bg-green-900/20', headerColor: 'text-green-600 dark:text-green-400' },
];

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; dotColor: string }> = {
    high: { label: 'High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dotColor: 'bg-red-500' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', dotColor: 'bg-yellow-500' },
    low: { label: 'Low', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dotColor: 'bg-gray-400' },
};

const emptyForm = {
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    assigned_to: '',
    due_at: '',
    status: 'todo' as TaskStatus,
};

function initials(name: string): string {
    const parts = name.split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

function formatDue(dueAt?: string): { text: string; overdue: boolean } | null {
    if (!dueAt) return null;
    const date = new Date(dueAt);
    const now = new Date();
    const overdue = date < now;
    return { text: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), overdue };
}

const Tasks = ({ projectId }: TasksProps) => {
    const { data: tasksData } = useTasks(projectId);
    const tasks = tasksData?.data || [];
    const { data: usersData } = useUsersDropdown();
    const users = usersData?.data || [];

    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);
    const updateTaskStatus = useUpdateTaskStatusMutation();
    const createTask = useCreateTaskMutation();
    const updateTask = useUpdateTaskMutation();
    const deleteTask = useDeleteTaskMutation();
    const { toast } = useToast();

    // Create dialog
    const [createOpen, setCreateOpen] = useState(false);
    const [createStatus, setCreateStatus] = useState<TaskStatus>('todo');
    const [createForm, setCreateForm] = useState({ ...emptyForm });

    // Edit dialog
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
    const [editForm, setEditForm] = useState({ ...emptyForm });

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState<KanbanTask | null>(null);

    // Priority filter
    const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
    const [assigneeFilter, setAssigneeFilter] = useState<'all' | string>('all');
    const [search, setSearch] = useState('');

    const transitionStatus = async (task: KanbanTask, status: TaskStatus) => {
        if (task.status === status) return;
        try {
            await updateTaskStatus.mutateAsync({ id: String(task.id), status });
        } catch {
            toast({ title: 'Failed to update status', variant: 'destructive' });
        }
    };

    const handleDrop = async (status: TaskStatus) => {
        if (draggedTaskId === null) return;
        const task = tasks.find(t => t.id === draggedTaskId);
        if (!task || task.status === status) { setDraggedTaskId(null); setDragOverCol(null); return; }
        try {
            await updateTaskStatus.mutateAsync({ id: String(draggedTaskId), status });
        } catch {
            toast({ title: 'Failed to move task', variant: 'destructive' });
        } finally {
            setDraggedTaskId(null);
            setDragOverCol(null);
        }
    };

    const openCreate = (status: TaskStatus) => {
        setCreateStatus(status);
        setCreateForm({ ...emptyForm, status });
        setCreateOpen(true);
    };

    const handleCreate = async () => {
        if (!createForm.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
        if (!projectId) return;
        try {
            await createTask.mutateAsync({
                title: createForm.title,
                description: createForm.description || undefined,
                project_id: projectId,
                status: createStatus,
                priority: createForm.priority,
                assigned_to: createForm.assigned_to || undefined,
                due_at: createForm.due_at || undefined,
            });
            setCreateOpen(false);
            setCreateForm({ ...emptyForm });
            toast({ title: 'Task created' });
        } catch (err: any) {
            toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create task', variant: 'destructive' });
        }
    };

    const openEdit = (task: KanbanTask) => {
        setEditingTask(task);
        setEditForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            assigned_to: task.assigneeId || '',
            due_at: task.dueAt ? task.dueAt.substring(0, 10) : '',
            status: task.status,
        });
        setEditOpen(true);
    };

    const handleEdit = async () => {
        if (!editingTask || !editForm.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
        try {
            await updateTask.mutateAsync({
                id: String(editingTask.id),
                data: {
                    title: editForm.title,
                    description: editForm.description || undefined,
                    status: editForm.status,
                    priority: editForm.priority,
                    assigned_to: editForm.assigned_to || undefined,
                    due_at: editForm.due_at || undefined,
                },
            });
            setEditOpen(false);
            setEditingTask(null);
            toast({ title: 'Task updated' });
        } catch (err: any) {
            toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update task', variant: 'destructive' });
        }
    };

    const handleDelete = async (task: KanbanTask) => {
        try {
            await deleteTask.mutateAsync(String(task.id));
            setDeleteConfirm(null);
            toast({ title: 'Task deleted' });
        } catch {
            toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
        }
    };

    const filteredTasks = tasks.filter(t => {
        const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter;
        const assigneeMatch = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;
        const query = search.trim().toLowerCase();
        const searchMatch = !query
            || t.title.toLowerCase().includes(query)
            || (t.description || '').toLowerCase().includes(query)
            || (t.assignee || '').toLowerCase().includes(query);
        return priorityMatch && assigneeMatch && searchMatch;
    });
    const totalCount = tasks.length;

    return (
        <div>
            {/* Board header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-foreground">Kanban Board</h3>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{totalCount} tasks</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                            className="h-8 w-44 rounded-md border border-input bg-background pl-8 pr-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                        />
                    </div>

                    <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                    >
                        <option value="all">All Assignees</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>

                    {/* Priority filter */}
                    <div className="flex items-center gap-1 rounded-md border border-input bg-background p-0.5">
                        {(['all', 'high', 'medium', 'low'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPriorityFilter(p)}
                                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${priorityFilter === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                    <Button size="sm" onClick={() => openCreate('todo')}>
                        <Plus className="h-4 w-4" /> Add Task
                    </Button>
                </div>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {COLUMNS.map(col => {
                    const colTasks = filteredTasks.filter(t => t.status === col.key);
                    const isDragOver = dragOverCol === col.key;
                    return (
                        <div
                            key={col.key}
                            onDragOver={e => { e.preventDefault(); setDragOverCol(col.key); }}
                            onDragLeave={() => setDragOverCol(null)}
                            onDrop={() => handleDrop(col.key)}
                            className={`rounded-xl border-2 transition-colors p-3 ${col.color} ${isDragOver ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                        >
                            {/* Column header */}
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-sm font-bold uppercase tracking-wider ${col.headerColor}`}>{col.label}</h4>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.headerColor} bg-white/60 dark:bg-black/20`}>{colTasks.length}</span>
                                </div>
                                <button
                                    onClick={() => openCreate(col.key)}
                                    className={`rounded-md p-1 transition-colors hover:bg-white/60 dark:hover:bg-black/20 ${col.headerColor}`}
                                    title={`Add task to ${col.label}`}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Task cards */}
                            <div className="space-y-2.5 min-h-[120px]">
                                {colTasks.map(task => {
                                    const due = formatDue(task.dueAt);
                                    const assigneeName = task.assignee || '';
                                    const pConf = PRIORITY_CONFIG[task.priority];
                                    return (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={() => setDraggedTaskId(task.id)}
                                            className="group rounded-lg border border-border bg-card shadow-sm p-3.5 cursor-move hover:shadow-md transition-all"
                                        >
                                            {/* Priority + actions row */}
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pConf.color}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${pConf.dotColor}`} />
                                                    {pConf.label}
                                                </span>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={e => { e.stopPropagation(); openEdit(task); }}
                                                        className="rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                        title="Edit task"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); setDeleteConfirm(task); }}
                                                        className="rounded p-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                        title="Delete task"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <p
                                                className="text-sm font-semibold text-card-foreground leading-snug cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => openEdit(task)}
                                            >
                                                {task.title}
                                            </p>

                                            {/* Description preview */}
                                            {task.description && (
                                                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}

                                            {/* Footer row: due date + assignee */}
                                            <div className="mt-2.5 flex items-center justify-between">
                                                <div className="flex items-center gap-1.5">
                                                    {due && (
                                                        <span className={`flex items-center gap-1 text-[10px] font-medium ${due.overdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                                                            {due.overdue ? <AlertCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                                            {due.text}
                                                        </span>
                                                    )}
                                                </div>
                                                {assigneeName && assigneeName !== 'Unassigned' && (
                                                    <div
                                                        className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary"
                                                        title={assigneeName}
                                                    >
                                                        {initials(assigneeName)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center gap-1.5">
                                                {task.status !== 'todo' && (
                                                    <button
                                                        onClick={() => transitionStatus(task, 'todo')}
                                                        className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                                                    >
                                                        To Do
                                                    </button>
                                                )}
                                                {task.status !== 'in-progress' && (
                                                    <button
                                                        onClick={() => transitionStatus(task, 'in-progress')}
                                                        className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                                                    >
                                                        In Progress
                                                    </button>
                                                )}
                                                {task.status !== 'done' && (
                                                    <button
                                                        onClick={() => transitionStatus(task, 'done')}
                                                        className="rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                                                    >
                                                        Done
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {colTasks.length === 0 && (
                                    <div
                                        onClick={() => openCreate(col.key)}
                                        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/50 py-6 text-muted-foreground/50 cursor-pointer hover:border-primary/30 hover:text-muted-foreground transition-colors"
                                    >
                                        <Plus className="h-5 w-5 mb-1" />
                                        <span className="text-xs">Add a task</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Task Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Task</DialogTitle>
                        <DialogDescription>Add a new task to <strong>{COLUMNS.find(c => c.key === createStatus)?.label}</strong>.</DialogDescription>
                    </DialogHeader>
                    <TaskForm
                        form={createForm}
                        setForm={setCreateForm}
                        users={users}
                        showStatusField={false}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={createTask.isPending}>
                            {createTask.isPending ? 'Creating...' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Task Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>Update the task details.</DialogDescription>
                    </DialogHeader>
                    <TaskForm
                        form={editForm}
                        setForm={setEditForm}
                        users={users}
                        showStatusField={true}
                    />
                    <DialogFooter className="gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="mr-auto"
                            onClick={() => { setEditOpen(false); setDeleteConfirm(editingTask); }}
                        >
                            <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={updateTask.isPending}>
                            {updateTask.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" /> Delete Task
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>"{deleteConfirm?.title}"</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            disabled={deleteTask.isPending}
                        >
                            {deleteTask.isPending ? 'Deleting...' : 'Delete Task'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Reusable form component
interface TaskFormProps {
    form: typeof emptyForm;
    setForm: (f: typeof emptyForm) => void;
    users: { id: string; name: string; email: string }[];
    showStatusField: boolean;
}

const TaskForm = ({ form, setForm, users, showStatusField }: TaskFormProps) => {
    const inputClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30';
    const labelClass = 'mb-1.5 block text-sm font-medium text-foreground';

    return (
        <div className="space-y-3 py-2">
            <div>
                <label className={labelClass}>Title *</label>
                <input
                    className={inputClass}
                    placeholder="Task title..."
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />
            </div>
            <div>
                <label className={labelClass}>Description</label>
                <textarea
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                    rows={3}
                    placeholder="Describe the task..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Priority</label>
                    <select
                        className={inputClass}
                        value={form.priority}
                        onChange={e => setForm({ ...form, priority: e.target.value as TaskPriority })}
                    >
                        <option value="high">🔴 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">⚪ Low</option>
                    </select>
                </div>
                {showStatusField && (
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            className={inputClass}
                            value={form.status}
                            onChange={e => setForm({ ...form, status: e.target.value as TaskStatus })}
                        >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                )}
                {!showStatusField && (
                    <div>
                        <label className={labelClass}>Due Date</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={form.due_at}
                            onChange={e => setForm({ ...form, due_at: e.target.value })}
                        />
                    </div>
                )}
            </div>
            {showStatusField && (
                <div>
                    <label className={labelClass}>Due Date</label>
                    <input
                        type="date"
                        className={inputClass}
                        value={form.due_at}
                        onChange={e => setForm({ ...form, due_at: e.target.value })}
                    />
                </div>
            )}
            <div>
                <label className={labelClass}>Assignee</label>
                <select
                    className={inputClass}
                    value={form.assigned_to}
                    onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                >
                    <option value="">Unassigned</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Tasks;
