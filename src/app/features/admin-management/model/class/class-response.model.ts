export interface ClassResponse {
  id: number;
  className: string;
  center: string;
  hour: string;
  days: string;
  status: string;
  sem: string;
  teacherName: string;
  courseCode: string;
  createdAt: Date;  // Typically provided by the backend
  students?: any[]; // Optional if there are students linked to the class
}
