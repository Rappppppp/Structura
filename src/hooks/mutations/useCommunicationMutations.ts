/**
 * Communication Mutation Hooks
 * Provides React Query hooks for communication mutations
 */

import { useMutation } from '@tanstack/react-query';
import { communicationService, CreateMessageRequest, CreateChatRoomRequest } from '@/api/communication.service';
import { queryClient } from '@/lib/queryClient';

/**
 * Hook to send a message to a chat room
 */
export const useSendMessageMutation = () => {
  return useMutation({
    mutationFn: (data: CreateMessageRequest) => communicationService.sendMessage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['messages', variables.chat_room_id],
      });

      queryClient.invalidateQueries({
        queryKey: ['chatRooms'],
      });
    },
  });
};

/**
 * Hook to create a new chat room
 */
export const useCreateChatRoomMutation = () => {
  return useMutation({
    mutationFn: (data: CreateChatRoomRequest) => communicationService.createChatRoom(data),
    onSuccess: () => {
      // Invalidate chat rooms list
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
};

/**
 * Hook to create a timeline event
 */
export const useCreateTimelineEventMutation = () => {
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      communicationService.createTimelineEvent(projectId, data),
    onSuccess: (_, variables) => {
      // Invalidate timeline for this project
      queryClient.invalidateQueries({
        queryKey: ['timeline', variables.projectId],
      });
    },
  });
};
