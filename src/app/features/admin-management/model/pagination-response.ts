import { StudentResponse } from "./student-response.model.";

export interface PaginatedStudentResponse {
    content: StudentResponse[];  // Mảng sinh viên
    totalElements: number;       // Tổng số sinh viên
    totalPages: number;          // Tổng số trang (thêm vào đây)
    size: number;                // Số phần tử mỗi trang (có thể thêm vào nếu cần)
  }
  