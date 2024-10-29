import { SubjectPerformance } from "./subject-performance-response.model";

export interface StudentPerformanceResponse {
  firstSubjectSchedules: string; // Ngày lịch của môn đầu
  lastSubjectSchedules: string;  // Ngày lịch của môn cuối
  subjectPerformances: SubjectPerformance[]; // Danh sách các môn học
}
