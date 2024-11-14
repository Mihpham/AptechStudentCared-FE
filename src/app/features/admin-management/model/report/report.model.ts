export interface ReportData {
  className: string;
  subject: string;
  sro: string;
  teacher: string;
  totalStudents: number;
  totalDiscussionsNeeded: number;
  totalDiscussionsDone: number; 
  totalLate: number;
  totalAwarenessIssues: number;
  latePercentage: number;
  awarenessPercentage: number;


  // Breakdown data
  breakdown?: {
    // attendance: { done: number, needed: number },
    late: { done: number, needed: number },
    absence: { done: number, needed: number },
    awareness: { done: number, needed: number },
    competency: { done: number, needed: number },
    homework: {
      lateSubmission: { done: number, needed: number },
      noSubmission: { done: number, needed: number },
    },
    retake: {
      retest: { done: number, needed: number },
      reclass: { done: number, needed: number },
    },
    communication: {
      parentCommunication: { done: number, needed: number },
      ahCommunication: { done: number, needed: number },
    }
  };
}
interface AverageRates {
  lateRate: number;
  absenceRate: number;
  disciplineRate: number;
  competencyRate: number;
  lateSubmissionRate: number;
  noSubmissionRate: number;
}

interface SubjectAverageRates {
  [subject: string]: AverageRates;
}

 export interface ClassAverageRates {
  [className: string]: SubjectAverageRates;
}
export interface ReportData {
  className: string;
  subject: string;
  sro: string;
  teacher: string;
  totalStudents: number;
  totalDiscussionsNeeded: number;
  totalDiscussionsDone: number; 
  totalLate: number;
  totalAwarenessIssues: number;
  latePercentage: number;
  awarenessPercentage: number;


  // Breakdown data
  breakdown?: {
    // attendance: { done: number, needed: number },
    late: { done: number, needed: number },
    absence: { done: number, needed: number },
    awareness: { done: number, needed: number },
    competency: { done: number, needed: number },
    homework: {
      lateSubmission: { done: number, needed: number },
      noSubmission: { done: number, needed: number },
    },
    retake: {
      retest: { done: number, needed: number },
      reclass: { done: number, needed: number },
    },
    communication: {
      parentCommunication: { done: number, needed: number },
      ahCommunication: { done: number, needed: number },
    }
  };
}
// src/app/models/attendance-record.model.ts
export interface AttendanceRecordSubject { 
  class: string;              // Lớp học
  subjectFC: string;          // Môn học
  totalStudents: number
  lateRate: number;           // Tỷ lệ đi học muộn (%)
  absenceRate: number;        // Tỷ lệ nghỉ học (%)
  disciplineRate: number;     // Tỷ lệ ý thức (%)
  competencyRate: number;     // Tỷ lệ năng lực (%)
  lateSubmissionRate: number; // Tỷ lệ nộp muộn (%)
  noSubmissionRate: number;   // Tỷ lệ không nộp (%)
}
export interface AttendanceRecordDay { 
  class: string;              // Lớp học
  subjectFC: string;   
  day : string; 
  totalStudents: number
  lateRate: number;           // Tỷ lệ đi học muộn (%)
  absenceRate: number;        // Tỷ lệ nghỉ học (%)
  disciplineRate: number;     // Tỷ lệ ý thức (%)
  competencyRate: number;     // Tỷ lệ năng lực (%)
  lateSubmissionRate: number; // Tỷ lệ nộp muộn (%)
  noSubmissionRate: number;   // Tỷ lệ không nộp (%)
}
export interface AVGAttendanceRecord { 
  class: string;              // Lớp học
  subjectFC: string;          // Môn học 
  AvgLateRate: number;           // Tỷ lệ đi học muộn (%)
  AvgAbsenceRate: number;        // Tỷ lệ nghỉ học (%)
  AvgDisciplineRate: number;     // Tỷ lệ ý thức (%)
  AvgCompetencyRate: number;     // Tỷ lệ năng lực (%)
  AvgCateSubmissionRate: number; // Tỷ lệ nộp muộn (%)
  AvgNoSubmissionRate: number;   // Tỷ lệ không nộp (%)
}