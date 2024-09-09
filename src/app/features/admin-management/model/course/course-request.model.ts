export interface CourseRequest {
    courseName: string;            // Tên khóa học
    courseCode: string;            // Mã khóa học
    courseCompTime: string;        // Thời gian hoàn thành khóa học
    semesters: {                   // Danh sách các môn học theo từng kỳ
      sem1?: string[];              // Môn học của kỳ 1
      sem2?: string[];              // Môn học của kỳ 2
      sem3?: string[];              // Môn học của kỳ 3
      sem4?: string[];             // Môn học của kỳ 4 (không bắt buộc)
    };
  }
  