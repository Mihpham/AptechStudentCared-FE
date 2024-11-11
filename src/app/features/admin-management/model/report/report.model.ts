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
