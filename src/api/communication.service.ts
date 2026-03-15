/**
 * Communication API Service
 * Handles messages, chat rooms, and timeline events
 */

import { apiRequest } from '@/lib/api.client';
import { ChatRoom, TimelineEvent } from '@/types/communication';

export interface CreateMessageRequest {
  chat_room_id: string;
  content: string;
}

export interface CreateChatRoomRequest {
  name: string;
  project_id: string;
  members?: string[];
}

export interface MessagesListResponse {
  data: any[];
}

export interface ChatRoomsListResponse {
  data: ChatRoom[];
}

export interface TimelineListResponse {
  data: TimelineEvent[];
}

export const communicationService = {
  /**
   * Get all chat rooms
   */
  getChatRooms: (): Promise<ChatRoomsListResponse> =>
    apiRequest.get('/chat-rooms'),

  /**
   * Get messages for a specific chat room
   */
  getMessages: (chatRoomId: string, params?: { page?: number; perPage?: number }): Promise<MessagesListResponse> =>
    apiRequest.get(`/chat-rooms/${chatRoomId}/messages`, { params }),

  /**
   * Send message to chat room
   */
  sendMessage: (data: CreateMessageRequest): Promise<{ data: any }> =>
    apiRequest.post('/messages', data),

  /**
   * Create new chat room
   */
  createChatRoom: (data: CreateChatRoomRequest): Promise<{ data: ChatRoom }> =>
    apiRequest.post('/chat-rooms', data),

  /**
   * Get timeline events for a project
   */
  getTimeline: (projectId: string, params?: { limit?: number }): Promise<TimelineListResponse> =>
    apiRequest.get(`/projects/${projectId}/timeline`, { params }),

  /**
   * Create timeline event
   */
  createTimelineEvent: (projectId: string, data: any): Promise<{ data: TimelineEvent }> =>
    apiRequest.post(`/projects/${projectId}/timeline`, data),
};
