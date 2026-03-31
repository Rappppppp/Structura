/**
 * Attendance Query Hooks
 * Provides React Query hooks for fetching attendance data
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceService } from '@/api/attendance.service';

/**
 * Hook to fetch attendance records with filters
 */
export const useAttendanceRecords = (filters?: {
  startDate?: string;
  endDate?: string;
  scope?: string;
  scopeId?: string;
  page?: number;
  perPage?: number;
}) => {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => attendanceService.getRecords(filters),
    staleTime: 0, // Fresh data always
  });
};

/**
 * Hook to fetch current check-in status
 * Poll every 2 seconds to show live time elapsed and status changes
 */
export const useActiveAttendance = () => {
  return useQuery({
    queryKey: ['attendance', 'active'],
    queryFn: () => attendanceService.getActive(),
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
    staleTime: 0,
    enabled: true,
  });
};

/**
 * Hook to fetch a single attendance record
 */
export const useAttendanceRecord = (attendanceId: string | undefined | null) => {
  return useQuery({
    queryKey: ['attendance', attendanceId],
    queryFn: () => attendanceService.getById(attendanceId!),
    enabled: !!attendanceId,
    staleTime: 0,
  });
};
