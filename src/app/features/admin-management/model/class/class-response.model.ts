import { CourseResponse } from "../course/course-response.model";
import { StudentInClassResponse } from "./student-in-class-response.model";

import{DayOfWeek} from "src/app/core/enum/DayOfWeek"
export interface ClassResponse {
    id: number;
    className: string;
    center: string;
    hour: string; 
    days: DayOfWeek[]; // Đảm bảo rằng days là mảng DayOfWeek[]
    createdAt: Date;
    status: string;
    sem: string;
    subjectTeacherMap: { [subjectCode: string]: string };
    students: StudentInClassResponse[];
    course: CourseResponse;
}
