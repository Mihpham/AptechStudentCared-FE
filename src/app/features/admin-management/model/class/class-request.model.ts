import { DayOfWeek } from "src/app/core/enum/DayOfWeek";

export interface ClassRequest {
  id: number;
  className: string;
  center: string;
  hour: string;
  days: DayOfWeek[];
  status: string;
  sem: string;
  teacherName: string;
  courseCode: string;
  
  createdAt?: Date; // Optional if createdAt is set by the backend on creation
}
