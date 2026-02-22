'use client';

import { useState, useRef, useEffect } from 'react';
import { Wand2, Send, Loader2, Plus, MessageSquare, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Message {
  id: string;
  text: string;
  image?: string;
  isLoading?: boolean;
  timestamp: Date;
}

export default function DesignAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Add loading message
    const loadingId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: loadingId,
      text: 'Generating your design...',
      isLoading: true,
      timestamp: new Date()
    }]);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Generated design for: "${input}"`,
        image: 'placeholder',
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(m => m.id !== loadingId).concat(aiMessage));
      toast({
        title: 'Design Generated',
        description: 'Your AI design has been created successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate design. Please try again.'
      });
      setMessages(prev => prev.filter(m => m.id !== loadingId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`flex flex-col w-64 border-r border-border bg-card transition-all duration-300 fixed lg:relative h-full z-50 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          {/* Sidebar Header */}
          <div className="p-3 sm:p-4 border-b border-border">
            <Button onClick={handleNewChat} className="w-full gap-2 rounded-lg text-sm">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3">
            <div className="space-y-2">
              {messages.filter(m => !m.isLoading && !m.image).map(msg => (
                <div
                  key={msg.id}
                  className="p-2 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors group"
                >
                  <p className="text-xs sm:text-sm text-foreground truncate">{msg.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-muted-foreground">
                  <MessageSquare className="h-6 sm:h-8 w-6 sm:w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs sm:text-sm">No chats yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 sm:p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="truncate">Design Assistant</span>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="shrink-0 lg:hidden"
              >
                ☰
              </Button>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                  <Wand2 className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-semibold text-sm sm:text-base text-foreground truncate">AI Design Assistant</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Concept visualization powered by AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="rounded-full bg-primary/10 p-3 sm:p-4 mb-3 sm:mb-4">
                  <Wand2 className="h-8 sm:h-12 w-8 sm:w-12 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Design Assistant</h2>
                <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-4 sm:mb-6">
                  Describe your architectural design ideas and I'll generate stunning visualizations powered by AI.
                </p>
                <div className="bg-card border border-border rounded-lg p-3 sm:p-4 max-w-md text-left text-pretty">
                  <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">Try asking:</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">"Generate a 3D concept of a 5-storey commercial building with glass façade and rooftop garden"</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.image ? 'justify-end' : 'justify-start'}`}>
                    <div className={`w-full sm:max-w-2xl ${msg.image ? 'bg-primary/90 text-primary-foreground' : 'bg-card border border-border'} rounded-lg p-3 sm:p-4 break-words`}>
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">{msg.text}</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          {msg.image && (
                            <div className="mt-3">
                              w   <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                                <div className="text-center">
                                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-2">
                                    <Wand2 className="h-6 w-6" />
                                  </div>
                                  <p className="text-xs opacity-75">Design Preview</p>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="mt-2 gap-2 text-xs">
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-6 border-t border-border bg-background">
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Textarea
                  placeholder="Describe your design idea... (Shift+Enter for new line)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="gap-2 h-10 sm:h-fit w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sm:hidden">Send</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              AI Design Assistant • Powered by advanced image generation
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
