export interface Schedule {
  scheduleId: number;
  startDate: string;
  endDate: string;
  subjectCode: string;
  className: string;
  status: string;
  note: string;
  isHoliday?: boolean; 
}
