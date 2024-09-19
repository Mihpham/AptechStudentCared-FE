export interface ClassRequest {
  id: number;
  className: string;
  center: string;
  hour: string;
  days: string;
  status: string;
  sem: string;
  teacherName: string;
  courseCode: string;
  
  createdAt?: Date; // Optional if createdAt is set by the backend on creation
}
