/**
 * Attendance Mutation Hooks
 * Provides React Query hooks for attendance mutations
 */

import { useMutation } from '@tanstack/react-query';
import { attendanceService } from '@/api/attendance.service';
import { queryClient } from '@/lib/queryClient';
import { CheckInPayload, CheckOutPayload } from '@/types/attendance';

/**
 * Hook to check in
 */
export const useCheckInMutation = () => {
  return useMutation({
    mutationFn: (payload: CheckInPayload) => attendanceService.checkIn(payload),
    onSuccess: () => {
      // Invalidate active attendance and records
      queryClient.invalidateQueries({ queryKey: ['attendance', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};

/**
 * Hook to check out
 */
export const useCheckOutMutation = () => {
  return useMutation({
    mutationFn: (payload: CheckOutPayload) => 
      attendanceService.checkOut(payload.attendanceId, payload),
    onSuccess: () => {
      // Invalidate active attendance and records
      queryClient.invalidateQueries({ queryKey: ['attendance', 'active'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
};
