import { ChangeEvent, useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useProjectFiles } from '@/hooks/queries/useProjectFiles';
import { useDeleteProjectFileMutation, useUploadProjectFileMutation } from '@/hooks/mutations/useProjectFileMutations';
import { useCurrentUser } from '@/hooks/queries/useAuth';

interface FilesProps {
    projectId?: string;
}

const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Files = ({ projectId }: FilesProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { data, isLoading } = useProjectFiles(projectId);
    const uploadMutation = useUploadProjectFileMutation(projectId || '');
    const deleteMutation = useDeleteProjectFileMutation(projectId || '');
    const { data: currentUserData } = useCurrentUser();
    const currentUser = currentUserData?.data?.user;

    const files = data?.data || [];

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        event.target.value = '';

        if (!selectedFile) {
            return;
        }

        if (!projectId) {
            toast({ title: 'Error', description: 'Project not found', variant: 'destructive' });
            return;
        }

        try {
            await uploadMutation.mutateAsync(selectedFile);
            toast({ title: 'Success', description: 'File uploaded' });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to upload file',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (fileId: string) => {
        if (!projectId) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(fileId);
            toast({ title: 'Success', description: 'File deleted' });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to delete file',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4">
            <div
                className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors"
                onClick={handleUploadClick}
            >
                <div className="text-center">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Click to upload file</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports PDF, DWG, DXF, DOC, DOCX, PNG, JPG</p>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.dwg,.dxf,.doc,.docx,.png,.jpg,.jpeg,.webp"
            />

            {isLoading ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">Loading files...</div>
            ) : files.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">No files uploaded yet.</div>
            ) : (
                <div className="rounded-lg border border-border bg-card">
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0">
                            <div className="min-w-0">
                                <a href={file.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-foreground hover:text-primary truncate block">
                                    {file.name}
                                </a>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(file.size_bytes)}{file.uploaded_by ? ` • Uploaded by ${file.uploaded_by}` : ''}
                                </p>
                            </div>
                            {currentUser?.role !== 'client' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(file.id)}
                                disabled={deleteMutation.isPending}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            )}
                            
                        </div>
                    ))}
                </div>
            )}

            {(uploadMutation.isPending || deleteMutation.isPending) && (
                <p className="text-xs text-muted-foreground">
                    {uploadMutation.isPending ? 'Uploading file...' : 'Updating files...'}
                </p>
            )}
        </div>
    );
};

export default Files;