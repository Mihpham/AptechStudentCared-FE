import { CourseResponse } from "../course/course-response.model";
import { StudentInClassResponse } from "./student-in-class-response.model";

export interface ClassResponse {
    id: number;
    className: string;
    center: string;
    hour: string; // Giữ nguyên nếu bạn muốn dùng kiểu chuỗi
    days: string;
    createdAt: Date; // Kiểu Date cho ngày tháng
    status: string;
    sem: string; // Thêm thuộc tính sem
    subjectTeacherMap: { [subjectCode: string]: string }; // Thêm thuộc tính subjectTeacherMap
    students: StudentInClassResponse[]; // Danh sách sinh viên
    course: CourseResponse; // Thêm thông tin khóa học
}
