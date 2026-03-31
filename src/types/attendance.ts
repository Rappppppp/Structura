export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  scope: 'global' | 'project' | 'team';
  scopeId?: string;
  scopeName?: string;
  checkInTime: string;
  checkOutTime?: string;
  checkInPhoto?: string;
  checkOutPhoto?: string;
  duration?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface CheckInPayload {
  scope: 'global' | 'project' | 'team';
  scopeId?: string;
  photo?: string; // base64 encoded
}

export interface CheckOutPayload {
  attendanceId: string;
  photo?: string; // base64 encoded
}

export interface AttendanceResponse {
  data: AttendanceRecord;
  message: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  pagination?: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface ActiveAttendance {
  isCheckedIn: boolean;
  attendance?: AttendanceRecord;
  checkInTime?: string;
  timeElapsed?: number; // in seconds
}
