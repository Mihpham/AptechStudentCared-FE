export interface SubjectClass {
    id: number; // ID duy nhất của khóa học
    courseName: string; // Tên khóa học
    courseCode: string; // Mã khóa học
    courseCompTime: string; // Thời gian hoàn thành khóa học
    semesters: {
        Sem1?: string[]; // Môn học của kỳ 1
        Sem2?: string[]; // Môn học của kỳ 2
        Sem3?: string[]; // Môn học của kỳ 3
        Sem4?: string[]; // Môn học của kỳ 4 (không bắt buộc)
        [key: string]: string[] | undefined; // Cho phép có thêm các kỳ khác
    };

}
