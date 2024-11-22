import { ClassResponse } from "./class-response.model";

export interface PaginatedClassResponse {
    content: ClassResponse[];
    totalPages: number;
    totalElements: number;
  }
  