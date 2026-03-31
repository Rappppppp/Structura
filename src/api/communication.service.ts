/**
 * Communication API Service
 * Handles messages, chat rooms, and timeline events
 */

import { apiRequest } from '@/lib/api.client';
import { ChatRoom, TimelineEvent } from '@/types/communication';
import { formatTime, formatDate } from '@/lib/utils';

export interface CreateMessageRequest {
  chat_room_id: string;
  content: string;
}

export interface CreateChatRoomRequest {
  name?: string;
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
  getChatRooms: (params?: { project_id?: string; page?: number; perPage?: number }): Promise<ChatRoomsListResponse> =>
    apiRequest.get('/communication', {
      params: {
        project_id: params?.project_id,
        page: params?.page,
        per_page: params?.perPage,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data)
        ? response.data.map((room: any) => ({
            id: String(room.id),
            name: room.name,
            lastMessage: room.last_message || '',
            time: formatTime(room.last_message_at),
            unread: 0,
          }))
        : [],
    })),

  /**
   * Get messages for a specific chat room
   */
  getMessages: (chatRoomId: string, params?: { page?: number; perPage?: number }): Promise<MessagesListResponse> =>
    apiRequest.get(`/communication/${chatRoomId}`, {
      params: {
        page: params?.page,
        per_page: params?.perPage,
      },
    }).then((response: any) => ({
      data: Array.isArray(response?.data?.messages)
        ? response.data.messages.map((message: any) => ({
            id: message.id,
            content: message.message,
            created_at: message.created_at,
            user: message.user || null,
          }))
        : [],
    })),

  /**
   * Send message to chat room
   */
  sendMessage: (data: CreateMessageRequest): Promise<{ data: any }> =>
    apiRequest.post(`/communication/${data.chat_room_id}/messages`, { content: data.content }),

  /**
   * Create new chat room
   */
  createChatRoom: (data: CreateChatRoomRequest): Promise<{ data: ChatRoom }> =>
    apiRequest.post('/communication/rooms', {
      name: data.name,
      project_id: data.project_id,
    }).then((response: any) => ({
      ...response,
      data: {
        id: String(response?.data?.id),
        name: response?.data?.name,
        lastMessage: response?.data?.last_message || '',
        time: formatTime(response?.data?.last_message_at),
        unread: 0,
      },
    })),

  /**
   * Get timeline events for a project
   */
  getTimeline: (projectId: string, params?: { limit?: number }): Promise<TimelineListResponse> =>
    apiRequest.get('/admin/timeline-events', {
      params: {
        per_page: params?.limit,
      },
    }).then((response: any) => ({
      ...response,
      data: Array.isArray(response?.data)
        ? response.data
            .filter((event: any) => String(event.project_id) === String(projectId))
            .map((event: any) => ({
              date: formatDate(event.event_date),
              title: event.title,
              description: event.description || '',
            }))
        : [],
    })),

  /**
   * Create timeline event
   */
  createTimelineEvent: (projectId: string, data: any): Promise<{ data: TimelineEvent }> =>
    apiRequest.post('/admin/timeline-events', {
      project_id: projectId,
      title: data?.title,
      description: data?.description,
      event_date: data?.event_date || new Date().toISOString(),
    }).then((response: any) => ({
      ...response,
      data: {
        date: formatDate(response?.data?.event_date),
        title: response?.data?.title,
        description: response?.data?.description || '',
      },
    })),
};
