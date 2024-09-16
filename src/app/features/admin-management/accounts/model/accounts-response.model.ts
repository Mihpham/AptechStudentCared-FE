export interface AccountResponse {
  id: number;
  username: string;
  status: string;
  createdAt: string;  // Ensure this property exists
  updatedAt: string;
  action: boolean;
}
