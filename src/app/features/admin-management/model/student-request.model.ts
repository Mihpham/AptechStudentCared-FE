// src/app/models/student-request.model.ts
export interface StudentRequest {
  userId : string;
  classId:number;
  image?: string;
  fullName: string;
  password?: string;
  gender?: string;
  className: string;
  dob?: string;
  phoneNumber: string;
  email: string;
  address?: string;
  courses?: Set<string>;
  status?: string;
  parentFullName?: string;
  studentRelation?: string;
  parentPhone?: string;
  parentGender?: string;
}
