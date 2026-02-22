import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProjectStore } from '@/stores/project.store';
import { useInvoiceStore } from '@/stores/invoice.store';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { Brain, TrendingUp, Users, Clock, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const aiInsights = [
  { icon: TrendingUp, title: 'Revenue Forecast', description: 'Q2 revenue projected to increase 18% based on current pipeline.' },
  { icon: Clock, title: 'Timeline Risk', description: 'Metro Station Complex may face 2-week delay — suggest resource reallocation.' },
  { icon: Users, title: 'Team Optimization', description: 'Engineering team utilization at 92%. Consider onboarding for upcoming projects.' },
  { icon: Zap, title: 'Cost Efficiency', description: 'Material costs 8% below estimate on Skyline Tower. Lock in current supplier rates.' },
];

const Reports = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const { toast } = useToast();
  const statusData = useProjectStore((s) => s.statusData);
  const revenueData = useInvoiceStore((s) => s.revenueData);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Analytics and AI-generated insights</p>
        </div>
        {/* <Button onClick={() => setReportOpen(true)}>
          <Brain className="h-4 w-4" /> Generate Weekly Report
        </Button> */}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">Project Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(220 13% 91%)', fontSize: 13 }} />
              <Bar dataKey="active" fill="hsl(217 91% 50%)" radius={[4,4,0,0]} name="Active" />
              <Bar dataKey="completed" fill="hsl(162 63% 41%)" radius={[4,4,0,0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-card-foreground">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220 9% 46%)' }} tickFormatter={v => `₱${v / 1000000}M`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(220 13% 91%)', fontSize: 13 }} formatter={(value: number) => `₱${(value / 1000).toFixed(0)}K`} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(217 91% 50%)" fill="hsl(217 91% 50% / 0.15)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="hsl(0 84% 60%)" fill="hsl(0 84% 60% / 0.1)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-base font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> AI Insights
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {aiInsights.map((insight, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-5 animate-fade-in hover:shadow-md transition-shadow">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <insight.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-card-foreground">{insight.title}</h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Weekly Report</DialogTitle>
            <DialogDescription>Configure and generate an AI-powered weekly progress report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Report Period</label>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option>This Week (Feb 3 - Feb 9)</option>
                <option>Last Week (Jan 27 - Feb 2)</option>
                <option>Last 2 Weeks</option>
                <option>This Month</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Include Sections</label>
              <div className="space-y-2 mt-1.5">
                {['Project Status Summary', 'Revenue & Expenses', 'Team Performance', 'AI Insights & Recommendations'].map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-foreground">
                    <input type="checkbox" defaultChecked className="rounded border-input" /> {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button onClick={() => { setReportOpen(false); toast({ title: 'Report Generated', description: 'Your weekly report has been generated and is ready for download.' }); }}>
              <Brain className="h-4 w-4" /> Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reports;
