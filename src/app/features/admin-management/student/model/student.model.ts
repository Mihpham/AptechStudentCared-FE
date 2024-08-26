// src/app/student.model.ts

export interface Student {
    avatar: string;
    rollNumber: string;
    fullName: string;
    class: string;
    gender: string;
    email: string;
    phoneNumber: string;
    status: string;
    guardian: Guardian;
  }
  
  export interface Guardian {
    fullName: string;
    gender: string; // hoặc boolean nếu chỉ có male/female
    phoneNumber: string;
    relationship: string;
  }