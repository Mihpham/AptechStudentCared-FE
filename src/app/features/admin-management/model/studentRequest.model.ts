export interface StudentRequest {
  userId: number;
  image?: string;
  rollNumber: string;
  fullName: string;
  password: string;
  gender: string;
  className: string;
  dob: string; 
  phoneNumber: string;
  email: string;
  address: string;
  courses: string[]; 
  status: string;
  parentFullName: string;
  studentRelation: string;
  parentPhone: string;
  parentGender: string;
}
