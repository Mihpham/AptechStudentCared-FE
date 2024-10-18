export interface StudentPerformanceResponse {
  
  id: number; // Thêm id
  semester: string; 
  studentName: string | null; // Có thể là null
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
