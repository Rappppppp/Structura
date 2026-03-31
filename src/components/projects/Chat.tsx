import { MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast';
import { useChatRooms, useMessages } from '@/hooks/queries/useCommunication';
import { useCreateChatRoomMutation, useSendMessageMutation } from '@/hooks/mutations/useCommunicationMutations';
import { useAuth } from '@/contexts/AuthContext';

interface ChatProps {
    projectId?: string;
}

const Chat = ({ projectId }: ChatProps) => {
    const { user: currentUser } = useAuth();
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const { data: chatData } = useChatRooms(projectId);
    const sendMessageMutation = useSendMessageMutation();
    const createRoomMutation = useCreateChatRoomMutation();

    const rooms = chatData?.data || [];
    const selectedRoom = rooms.find((room) => room.id === selectedRoomId) || rooms[0];
    const { data: messagesData } = useMessages(selectedRoom ? String(selectedRoom.id) : '', 1, 50);
    const messages = messagesData?.data || [];

    useEffect(() => {
        if (!selectedRoomId && rooms.length > 0) {
            setSelectedRoomId(rooms[0].id);
        }
    }, [rooms, selectedRoomId]);

    const handleSend = async () => {
        if (!message.trim()) {
            return;
        }

        try {
            let roomId = selectedRoom?.id;

            if (!roomId) {
                if (!projectId) {
                    toast({ title: 'Error', description: 'Project not found for chat', variant: 'destructive' });
                    return;
                }

                const createdRoomResponse = await createRoomMutation.mutateAsync({
                    project_id: projectId,
                });

                roomId = createdRoomResponse.data.id;
                setSelectedRoomId(roomId);
            }

            await sendMessageMutation.mutateAsync({
                chat_room_id: roomId,
                content: message,
            });
            setMessage('');
            toast({ title: 'Success', description: 'Message sent' });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Failed to send message',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="rounded-lg border border-border bg-card p-6">
            {!selectedRoom ? (
                <div className="space-y-4">
                    <div className="flex h-48 items-center justify-center">
                        <div className="text-center">
                        <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-muted-foreground">No chat room found for this project</p>
                        <p className="text-xs text-muted-foreground mt-1">Send the first message to start project chat</p>
                        </div>
                    </div>
                    <div className="border-t border-border pt-4 flex gap-2">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                        />
                        <Button onClick={handleSend} disabled={sendMessageMutation.isPending || createRoomMutation.isPending}>Send</Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-4 border-b border-border pb-3">
                        <p className="text-sm font-semibold text-card-foreground">{selectedRoom.name}</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-3">
                        {messages.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No messages yet.</p>
                        ) : (
                            messages.map((msg) => {
                                const isOwnMessage = currentUser && msg.user?.id === currentUser.id;
                                const senderName = isOwnMessage ? 'You' : (msg.user?.name || 'Unknown');
                                
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs px-3 py-2 rounded-md text-sm ${
                                                isOwnMessage
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-background border border-border text-muted-foreground rounded-bl-none'
                                            }`}
                                        >
                                            {!isOwnMessage && (
                                                <p className="text-xs font-medium mb-1 opacity-70">{senderName}</p>
                                            )}
                                            <p className="leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="mt-4 border-t border-border pt-4 flex gap-2">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                        />
                        <Button onClick={handleSend} disabled={sendMessageMutation.isPending || createRoomMutation.isPending}>Send</Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Chat