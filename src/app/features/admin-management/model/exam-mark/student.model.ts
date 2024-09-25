import { Subject } from "./subject.model";
export interface Student {
    image: string;
    rollNumber: string;
    fullName: string;
    className: string;
    subjects: Subject[];
    hasChanges: boolean;
}