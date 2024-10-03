export interface StudentPerformanceResponse {
    studentName: string;
    subjectCode: string;
    theoreticalScore: number;
    presentCount: number;
    presentWithPermissionCount: number;
    absentCount: number;
    practicalScore: number;
    attendancePercentage: number;
    practicalPercentage: number;
    theoreticalPercentage: number;
  }