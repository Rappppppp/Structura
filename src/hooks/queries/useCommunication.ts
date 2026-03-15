/**
 * Communication Query Hooks
 * Provides React Query hooks for fetching chat and timeline data
 */

import { useQuery } from '@tanstack/react-query';
import { communicationService } from '@/api/communication.service';

/**
 * Hook to fetch all chat rooms
 */
export const useChatRooms = () => {
  return useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => communicationService.getChatRooms(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch messages for a specific chat room
 */
export const useMessages = (chatRoomId: string, page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['messages', chatRoomId, { page, perPage }],
    queryFn: () => communicationService.getMessages(chatRoomId, { page, perPage }),
    enabled: !!chatRoomId,
    staleTime: 0, // Fresh messages always
  });
};

/**
 * Hook to fetch timeline events for a project
 */
export const useTimeline = (projectId: string | undefined | null, limit = 50) => {
  return useQuery({
    queryKey: ['timeline', projectId, { limit }],
    queryFn: () => communicationService.getTimeline(projectId!, { limit }),
    enabled: !!projectId,
    staleTime: 0, // Fresh timeline always
  });
};
