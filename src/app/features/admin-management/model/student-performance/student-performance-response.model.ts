export interface StudentPerformanceResponse {
  id: number;
  studentName: string;
  subjectCode: string;
  theoreticalScore: number;
  presentCount: number;
  absentCount: number;
  presentWithPermissionCount: number;
  attendancePercentage: number;
  practicalPercentage: number;
  theoreticalPercentage: number;
}

// Interface cho phản hồi tổng thể từ API
export interface StudentPerformanceApiResponse {
  firstSubjectSchedules: string;  // Ngày tạo của môn đầu tiên
  lastSubjectSchedules: string;   // Ngày tạo của môn cuối cùng
  subjectPerformances: StudentPerformanceResponse[];
}
