import { apiClient } from "@/lib/api.client";
import { AttendanceRecord, CheckInPayload, CheckOutPayload, AttendanceResponse, AttendanceListResponse, ActiveAttendance } from "@/types/attendance";

export const attendanceService = {
  checkIn: async (payload: CheckInPayload): Promise<AttendanceRecord> => {
    const response = await apiClient.post<AttendanceResponse>("/attendance/check-in", payload);
    return response.data.data;
  },

  checkOut: async (attendanceId: string, payload: Partial<CheckOutPayload>): Promise<AttendanceRecord> => {
    const response = await apiClient.post<AttendanceResponse>(`/attendance/${attendanceId}/check-out`, payload);
    return response.data.data;
  },

  getRecords: async (filters?: {
    startDate?: string;
    endDate?: string;
    scope?: string;
    scopeId?: string;
    page?: number;
    perPage?: number;
  }): Promise<AttendanceListResponse> => {
    const response = await apiClient.get<AttendanceListResponse>("/attendance", { params: filters });
    return response.data;
  },

  getActive: async (): Promise<ActiveAttendance> => {
    const response = await apiClient.get<any>("/attendance/active");
    return (response.data?.data || { isCheckedIn: false }) as ActiveAttendance;
  },

  getById: async (attendanceId: string): Promise<AttendanceRecord> => {
    const response = await apiClient.get<AttendanceResponse>(`/attendance/${attendanceId}`);
    return response.data.data;
  },
};
