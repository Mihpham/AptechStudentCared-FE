import { Injectable } from '@angular/core';
import { ReportData } from 'src/app/features/admin-management/model/report/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reports: ReportData[] = [
    {
      className: 'A2409G',
      subject: 'Kỹ năng mềm',
      sro: 'Phạm Thị Kim Dung',
      teacher: 'Tô Hoàng Anh',
      totalStudents: 26,
      totalDiscussionsNeeded: 13,
      totalDiscussionsDone: 7,
      totalClassesHeld: 15,
      totalLate: 20,
      totalAwarenessIssues: 5,
      latePercentage: (20 / 26) * 100,
      awarenessPercentage: (5 / 26) * 100,
      breakdown: {
        attendance: { done: 6, needed: 10 },
        late: { done: 3, needed: 5 },
        absence: { done: 2, needed: 3 },
        awareness: { done: 3, needed: 4 },
        competency: { done: 4, needed: 5 },
        homework: {
          lateSubmission: { done: 1, needed: 3 },
          noSubmission: { done: 2, needed: 4 }
        },
        retake: {
          retest: { done: 1, needed: 2 },
          reclass: { done: 1, needed: 2 }
        },
        communication: {
          parentCommunication: { done: 2, needed: 3 },
          ahCommunication: { done: 1, needed: 2 }
        }
      }
    },
    {
      className: 'A2409G',
      subject: 'EPC',
      sro: 'Phạm Thị Kim Dung',
      teacher: 'Tô Hoàng Anh',
      totalStudents: 26,
      totalDiscussionsNeeded: 12,
      totalDiscussionsDone: 4,
      totalClassesHeld: 12,
      totalLate: 8,
      totalAwarenessIssues: 5,
      latePercentage: (8 / 26) * 100,
      awarenessPercentage: (5 / 26) * 100,
      breakdown: {
        attendance: { done: 4, needed: 8 },
        late: { done: 2, needed: 4 },
        absence: { done: 1, needed: 2 },
        awareness: { done: 2, needed: 3 },
        competency: { done: 2, needed: 3 },
        homework: {
          lateSubmission: { done: 1, needed: 2 },
          noSubmission: { done: 1, needed: 3 }
        },
        retake: {
          retest: { done: 0, needed: 1 },
          reclass: { done: 1, needed: 1 }
        },
        communication: {
          parentCommunication: { done: 1, needed: 2 },
          ahCommunication: { done: 1, needed: 1 }
        }
      }
    },
    // Add more mock data entries as needed
  ];

  getAllReports(): ReportData[] {
    return this.reports;
  }

  getReportByClassAndSubject(className: string, subject: string): ReportData | undefined {
    return this.reports.find(report => report.className === className && report.subject === subject);
  }
}
