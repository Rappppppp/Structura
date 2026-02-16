export interface ChatRoom {
  id: number;
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
