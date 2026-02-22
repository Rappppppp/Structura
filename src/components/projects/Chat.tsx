import { MessageSquare } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
    const { toast } = useToast();

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex h-48 items-center justify-center">
                <div className="text-center">
                    <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Project chat will appear here</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a conversation with your team</p>
                </div>
            </div>
            <div className="mt-4 border-t border-border pt-4 flex gap-2">
                <input placeholder="Type a message..." className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
                <Button onClick={() => toast({ title: 'Message Sent', description: 'Your message has been sent to the project chat.' })}>Send</Button>
            </div>
        </div>
    )
}

export default Chat