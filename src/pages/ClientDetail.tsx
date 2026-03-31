import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, MapPin, Building2, DollarSign, Briefcase } from 'lucide-react';
import { useClient } from '@/hooks/queries/useClients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Project {
  id: string | number;
  name: string;
  status?: string;
  budget?: string | number;
}

interface Client {
  id?: string | number;
  name: string;
  industry?: string;
  email?: string;
  phone?: string;
  location?: string;
  contact_person?: string;
  active_projects?: number;
  total_value?: string | number;
  projects?: Project[];
}

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">Invalid client ID</p>
          <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { data: clientResponse, isLoading, error } = useClient(id);
  const client = clientResponse?.data;

  console.log('ClientDetail Debug:', { clientResponse, client, error, isLoading });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !client || !client.id) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-2">Error loading client details</p>
          <p className="text-xs text-muted-foreground mb-4">
            {error ? `Error: ${error}` : `No client data. Client ID: ${client?.id}`}
          </p>
          <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/clients')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Clients
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{client.industry || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground break-all">{client.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground">{client.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground">{client.location || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Industry</p>
                  <p className="text-foreground">{client.industry || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Active Projects</span>
              <span className="text-lg font-bold text-primary">{client.active_projects || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Total Project Value</span>
              <span className="text-lg font-bold text-primary">${(client?.total_value || 0).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Contact Person */}
        {client.contact_person && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Primary Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground font-medium">{client.contact_person}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {client.projects && client.projects.length > 0 && (
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Associated Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {client.projects.map((project: Project) => (
                  <div 
                    key={project.id}
                    className="p-3 rounded-md border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <p className="font-medium text-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.status || 'In Progress'} • Budget: ${project.budget || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDetail;
