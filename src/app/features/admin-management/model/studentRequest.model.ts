export interface StudentRequest {
  rollNumber: string;
  fullName: string;
  password: string;
  gender: string;
  className: string;
  dob: string; // Consider using Date object if needed
  phoneNumber: string;
  email: string;
  address: string;
  courses: Set<string>; // or string[]
  status: string;
  parentFullName: string;
  studentRelation: string;
  parentPhone: string;
  parentGender: string;
  parentJob: string;
}
