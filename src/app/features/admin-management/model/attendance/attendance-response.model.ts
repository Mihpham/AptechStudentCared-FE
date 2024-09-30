export interface AttendanceResponse {
    id: number;
    studentId: number;
    scheduleId: number; 
    attendanceStatus1: string;
    attendanceStatus2: string;
    checkin1: string;
    checkin2: string;
    note: string;
    createdAt: string;
    scheduleDate: string;
  }
  