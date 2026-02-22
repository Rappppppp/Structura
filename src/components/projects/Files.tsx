import { useQuickActionStore } from '@/stores/project.detailed.quickaction.store';
import { quickActions } from './Overview';
import { FileText } from 'lucide-react';

const Files = () => {
    const { setActiveAction } = useQuickActionStore();

    return (
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setActiveAction(quickActions[0])}>
            <div className="text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">Supports blueprints, CAD files, and documents</p>
            </div>
        </div>
    )
}

export default Files