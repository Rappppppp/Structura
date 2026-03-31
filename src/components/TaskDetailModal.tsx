import { Task, TaskComment } from '@/types/task';
import { useTaskComments } from '@/hooks/queries/useTasks';
import { useAddTaskCommentMutation, useDeleteTaskCommentMutation } from '@/hooks/mutations/useTaskMutations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn, formatDate, formatDateTime } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-destructive/20 text-destructive',
  medium: 'bg-warning/20 text-warning',
  low: 'bg-success/20 text-success',
};

export const TaskDetailModal = ({ task, isOpen, onClose }: TaskDetailModalProps) => {
  const { toast } = useToast();
  const [commentContent, setCommentContent] = useState('');
  
  const { data: commentsData, isLoading: commentsLoading } = useTaskComments(task.id);
  const addCommentMutation = useAddTaskCommentMutation();
  const deleteCommentMutation = useDeleteTaskCommentMutation();

  const comments = (commentsData?.data || []) as TaskComment[];

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast({ description: 'Please enter a comment', variant: 'destructive' });
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        taskId: task.id,
        content: commentContent,
      });
      setCommentContent('');
      toast({ description: 'Comment added successfully' });
    } catch (err: any) {
      toast({
        description: err.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({
        taskId: task.id,
        commentId,
      });
      toast({ description: 'Comment deleted' });
    } catch (err: any) {
      toast({
        description: err.response?.data?.message || 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Details */}
          <div className="space-y-3">
            {task.description && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Description</h3>
                <p className="text-sm text-foreground">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Project</h3>
                <p className="text-sm text-foreground">{task.project.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Priority</h3>
                <Badge className={cn(PRIORITY_COLORS[task.priority])}>
                  {task.priority}
                </Badge>
              </div>

              {task.assignee && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Assigned To</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-foreground">{task.assignee.name}</p>
                  </div>
                </div>
              )}

              {task.due_at && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Due Date</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-foreground">
                      {formatDate(task.due_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Comments</h3>

            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-20"
              />
              <Button
                onClick={handleAddComment}
                disabled={addCommentMutation.isPending || !commentContent.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {commentsLoading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {comment.user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{comment.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(comment.created_at)}
                        </p>
                      </div>
                      <p className="text-sm text-foreground mt-1 break-words">{comment.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deleteCommentMutation.isPending}
                      className="text-destructive hover:text-destructive/80 flex-shrink-0"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
