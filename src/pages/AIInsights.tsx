import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Brain, Clock, MessageSquare, Wand2, CalendarCheck, FileCheck, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const aiFeatures = [
  { icon: Clock, title: 'AI Timeline Predictor', description: 'Predict project timelines based on historical data and current progress.', detail: 'Analyzes past project data to forecast completion dates and identify potential delays.' },
  { icon: MessageSquare, title: 'Chat Summarizer', description: 'Generate concise summaries of project chat conversations.', detail: 'Processes chat history and extracts key decisions, action items, and discussion points.' },
  { icon: Wand2, title: 'Design Generator', description: 'Create architectural design concepts using AI-assisted generation.', detail: 'Generates design concepts based on project requirements, site constraints, and style preferences.' },
  { icon: CalendarCheck, title: 'Task Scheduler', description: 'Automatically optimize task assignments and deadlines.', detail: 'Uses workload analysis and dependency mapping to optimize task scheduling across teams.' },
  { icon: FileCheck, title: 'Contract Checker', description: 'Analyze contracts for risks, compliance issues, and key terms.', detail: 'Scans contracts for potential risks, missing clauses, and compliance requirements.' },
  { icon: BarChart3, title: 'Weekly Report Generator', description: 'Automatically compile and format weekly project progress reports.', detail: 'Aggregates project metrics, milestones, and team updates into a formatted report.' },
];

const AIInsights = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof aiFeatures[0] | null>(null);
  const { toast } = useToast();

  const handleLaunch = () => {
    const name = selectedFeature?.title;
    setSelectedFeature(null);
    toast({ title: `${name} Started`, description: `The ${name} is now processing. Results will be available shortly.` });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" /> AI Insights
        </h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered tools for architecture project management</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {aiFeatures.map((feature, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6 animate-fade-in hover:shadow-md transition-shadow group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            <Button className="mt-4" onClick={() => setSelectedFeature(feature)}>Launch</Button>
          </div>
        ))}
      </div>

      {/* Feature Launch Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature && <selectedFeature.icon className="h-5 w-5 text-primary" />}
              {selectedFeature?.title}
            </DialogTitle>
            <DialogDescription>{selectedFeature?.detail}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Select Project</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>All Projects</option>
                <option>Skyline Tower</option>
                <option>Harbor Bridge Redesign</option>
                <option>Green Campus Hub</option>
                <option>Metro Station Complex</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Additional Notes</label>
              <textarea rows={3} placeholder="Any specific focus areas or parameters..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFeature(null)}>Cancel</Button>
            <Button onClick={handleLaunch}>
              <Brain className="h-4 w-4" /> Run {selectedFeature?.title}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AIInsights;
