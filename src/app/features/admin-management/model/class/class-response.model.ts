import { StudentInClassResponse } from "./student-in-class-response.model";

export interface ClassResponse {
    id: number;
    className: string;
    center: string;
    hour: string;  // If you decide to change hour to a numeric type (int or double), change it here as well
    days: string;
    createdAt: Date;  // In TypeScript, we use Date for date and time fields
    status: string;
    students: StudentInClassResponse[];
  }