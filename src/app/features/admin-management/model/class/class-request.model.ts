import { DayOfWeek } from "src/app/core/enum/DayOfWeek";

export interface ClassRequest {
  id: number;
  className: string;
  center: string;
  startHour: string;
  endHour: string;
  days: DayOfWeek[];
  status: string;
  sem: string;
  teacherName: string;
  courseCode: string;

  createdAt?: Date;
}
