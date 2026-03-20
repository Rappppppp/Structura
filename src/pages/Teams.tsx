import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * @deprecated Teams page is deprecated
 * Team members are now managed per-project in the Project Details page.
 * Use Projects > [Select Project] > Team Members tab to manage team assignments.
 */
const Teams = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">Team management has been restructured</p>
        </div>
      </div>

      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-start">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-foreground mb-2">Teams Tab Restructured</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The global Teams tab has been removed to provide a cleaner project structure. Team members are now managed directly within each project.
              </p>
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <p>✓ Assign users to specific projects with base roles (Admin/Member/Viewer)</p>
                <p>✓ Add specializations (Architect, Engineer, PM, BIM, etc.)</p>
                <p>✓ Manage permissions and access per team member</p>
              </div>
              <Button onClick={() => navigate('/projects')} className="gap-2">
                <span>Go to Projects</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-4">How to manage team members:</h3>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="font-semibold text-primary shrink-0">1.</span>
              <span>Go to <strong>Projects</strong> and select a project</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary shrink-0">2.</span>
              <span>Click on the project details or Team Members tab</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary shrink-0">3.</span>
              <span>Click <strong>Add Team Member</strong> to assign users</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary shrink-0">4.</span>
              <span>Select base role (Admin/Member/Viewer) and specialty role (Architect/Engineer/etc.)</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Teams;
