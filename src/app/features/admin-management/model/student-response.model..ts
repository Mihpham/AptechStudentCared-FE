export interface StudentResponse {
  userId: number;
  classId:number;
  image?: string;
  rollNumber: string;
  fullName: string;
  password: string;
  email: string;
  dob: string;
  address: string;
  className: string;
  gender: string;
  phoneNumber: string;
  courses: string[];
  status: string;
  parentFullName: string;
  studentRelation: string;
  parentPhone: string;
  parentGender: string;
}