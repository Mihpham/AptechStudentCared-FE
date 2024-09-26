export interface AccountResponse {
    id: number;             // ID của tài khoản
    fullName: string;       // Tên đầy đủ
    email: string;          // Email của tài khoản
    roleName: string;       // Vai trò của người dùng
    status: string;         // Trạng thái tài khoản
    createdAt: Date;        // Ngày tạo tài khoản
}