export type UserRole = "employee" | "director" | "accounts";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export type VoucherStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected";

export interface Voucher {
  _id: string;
  voucherNumber: string;
  voucherDate: string;
  expenseDate: string;
  department: string;
  expenseTitle: string;
  expenseCategory: string;
  expenseDescription?: string;
  amount: number;
  employee: User | string;
  employeeSignature?: string;
  status: VoucherStatus;
  director?: User | string;
  directorSignature?: string;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
