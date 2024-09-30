import { CourseResponse } from "../course/course-response.model";
import { StudentInClassResponse } from "./student-in-class-response.model";

import{DayOfWeek} from "src/app/core/enum/DayOfWeek"
import { SubjectTeacherResponse } from "./subject-teacher-response.model";
export interface ClassResponse {
    id: number;
    className: string;
    center: string;
    startHour: string; 
    endHour: string;   
    days: DayOfWeek[]; 
    createdAt: Date;
    status: string;
    sem: string;
    subjectTeachers: SubjectTeacherResponse[]; 
    students: StudentInClassResponse[];
    course: CourseResponse;
}
