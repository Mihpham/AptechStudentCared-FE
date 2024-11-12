import { CourseResponse } from "../course/course-response.model";
import { StudentInClassResponse } from "./student-in-class-response.model";

import{DayOfWeek} from "src/app/core/enum/DayOfWeek"
import { SubjectTeacherResponse } from "./subject-teacher-response.model";
import { StudentResponse } from "../student-response.model.";
export interface ClassDetailResponse {
    id: number;
    className: string;
    center: string;
    startHour: string; 
    endHour: string;   
    days: DayOfWeek[]; 
    createdAt: Date;
    status: string;
    semesterName: string;
    subjectTeachers: SubjectTeacherResponse[]; 
    students: StudentResponse[];
    course: CourseResponse;
    totalElements: number;  // The total number of students.
}
