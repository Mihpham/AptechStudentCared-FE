export interface SubjectPerformance {
    id: number; // ID của môn học
    semester: string; // Học kỳ
    studentName: string; // Tên sinh viên
    subjectCode: string; // Mã môn học
    theoreticalScore: number; // Điểm lý thuyết
    presentCount: number; // Số buổi có mặt
    presentWithPermissionCount: number; // Số buổi có mặt có phép
    absentCount: number; // Số buổi vắng
    practicalScore: number; // Điểm thực hành
    attendancePercentage: number; // Tỷ lệ điểm danh
    practicalPercentage: number; // Tỷ lệ điểm thực hành
    theoreticalPercentage: number; // Tỷ lệ điểm lý thuyết
  }