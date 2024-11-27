import { ExamScore } from "./exam-score.model";
export interface Student {
    image: string;
    className: string;
    listExamScore: ExamScore[];
    hasChanges: boolean;
}