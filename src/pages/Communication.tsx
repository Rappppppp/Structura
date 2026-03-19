import DashboardLayout from '@/components/layout/DashboardLayout';
import { useChatRooms, useMessages } from '@/hooks/queries/useCommunication';
import { useSendMessageMutation } from '@/hooks/mutations/useCommunicationMutations';
import { Send, Paperclip, Brain, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Communication = () => {
  const { data: chatData, isLoading: chatLoading } = useChatRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const { data: messagesData } = useMessages(selectedRoomId ? String(selectedRoomId) : '', 1, 50);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const sendMessageMutation = useSendMessageMutation();

  const chatRooms = chatData?.data || [];
  const selectedRoom = chatRooms.find(r => r.id === selectedRoomId) || chatRooms[0];
  const messages = messagesData?.data || [];

  // Initialize selected room on mount
  useEffect(() => {
    if (!selectedRoomId && chatRooms.length > 0) {
      setSelectedRoomId(chatRooms[0].id);
    }
  }, [chatRooms, selectedRoomId]);

  const handleSend = async () => {
    if (!message.trim() || !selectedRoom) return;

    try {
      await sendMessageMutation.mutateAsync({
        chat_room_id: String(selectedRoom.id),
        content: message
      });

      setMessage('');
      toast({ title: 'Success', description: 'Message sent' });
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to send message',
        variant: 'destructive' 
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Communication</h1>
        <p className="text-sm text-muted-foreground mt-1">Project chat rooms and team messaging</p>
      </div>

      {chatLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading chat rooms...</p>
        </div>
      ) : (
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
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full border-b border-border p-4 text-left transition-colors ${
                    selectedRoom?.id === room.id ? 'bg-muted' : 'hover:bg-muted/50'
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
                  <div className="mt-1">
                    <p className="text-xs text-muted-foreground truncate pr-2">{room.lastMessage || 'No messages'}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedRoom && (
            <div className="flex flex-col lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h3 className="text-sm font-semibold text-card-foreground">{selectedRoom.name}</h3>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => setSummaryOpen(true)}>
                  <Brain className="h-3.5 w-3.5" /> AI Summary
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className="text-sm">
                        <p className="font-medium text-foreground">{msg.user?.name || 'Unknown'}</p>
                        <p className="text-muted-foreground mt-1">{msg.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{msg.created_at}</p>
                      </div>
                    ))}
                  </div>
                )}
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
                  <Button size="icon" onClick={handleSend} disabled={sendMessageMutation.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* AI Summary Dialog */}
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Chat Summary</DialogTitle>
            <DialogDescription>AI-generated summary of the conversation{selectedRoom ? ` in ${selectedRoom.name}` : ''}.</DialogDescription>
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
