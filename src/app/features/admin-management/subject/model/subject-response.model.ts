export interface SubjectResponse {
  id: number;
  subjectName: string;
  subjectCode: string;
  totalHours: number;
  createdAt: Date;  // Ensure this property exists
  updatedAt: Date;
}
