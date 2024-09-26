export interface AccountRequest {
    id: number;            // ID tài khoản
    fullName: string;      // Tên đầy đủ
    email: string;         // Email của tài khoản
    roleName: string;      // Vai trò của tài khoản (ADMIN, USER, ...)
    status: string;        // Trạng thái của tài khoản (ACTIVE, INACTIVE, ...)
}