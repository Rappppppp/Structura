import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCommunicationStore } from '@/stores/communication.store';
import { Send, Paperclip, Brain, Search } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Communication = () => {
  const chatRooms = useCommunicationStore((s) => s.chatRooms);
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    if (!message.trim()) return;
    toast({ title: 'Message Sent', description: `Your message has been sent to ${selectedRoom.name}.` });
    setMessage('');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
        <p className="text-sm text-muted-foreground mt-1">Project chat rooms and team messaging</p>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-3 rounded-lg border border-border bg-card overflow-hidden animate-fade-in" style={{ height: 'calc(100vh - 220px)' }}>
        {/* Sidebar */}
        <div className="border-r border-border lg:col-span-1">
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search conversations..." className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {chatRooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full border-b border-border p-4 text-left transition-colors ${
                  selectedRoom.id === room.id ? 'bg-muted' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-card-foreground truncate pr-2">{room.name}</p>
                  {room.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {room.unread}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate pr-2">{room.lastMessage}</p>
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap">{room.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex flex-col lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-card-foreground">{selectedRoom.name}</h3>
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => setSummaryOpen(true)}>
              <Brain className="h-3.5 w-3.5" /> AI Summary
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">Messages will appear here</p>
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <button
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => toast({ title: 'Attach File', description: 'File attachment coming soon.' })}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Chat Summary</DialogTitle>
            <DialogDescription>AI-generated summary of the conversation in {selectedRoom.name}.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-foreground mb-2">Key Discussion Points:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
                <li>Design specifications were reviewed and approved</li>
                <li>Timeline adjustments discussed for Phase 2</li>
                <li>Material cost estimates shared by engineering team</li>
                <li>Client feedback incorporated into revised plans</li>
              </ul>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium text-foreground mb-1">Action Items:</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
                <li>Update floor plans by Friday</li>
                <li>Schedule follow-up meeting with client</li>
                <li>Submit revised budget proposal</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSummaryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Communication;
