export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}
