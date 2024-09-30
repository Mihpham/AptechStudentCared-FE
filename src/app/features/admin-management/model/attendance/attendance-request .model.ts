// attendance.model.ts
export interface AttendanceRequest {
    studentId: number;
    scheduleId: number;
    attendanceStatus1: string | null; // Adjust as needed
    attendanceStatus2: string | null; // Adjust as needed
    note?: string | null; // Optional field for comments // Optional comment
}
