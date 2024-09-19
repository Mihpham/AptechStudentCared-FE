export interface SroRequest {
    id?: number; 
    fullName: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    address: string;
    status: string;
    image?: string;  
    
  }
  
  export interface SroResponse {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    dob: string;
    roleName: string;
    status: string;
    image: string;
    createdAt: string;
  }
  