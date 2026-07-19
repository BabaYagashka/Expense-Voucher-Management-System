import api from "./api";
import type { ApiResponse, Voucher } from "@/types";

export interface EmployeeDashboardData {
  totalVouchers: number;
  draftVouchers: number;
  pendingApproval: number;
  approvedVouchers: number;
  rejectedVouchers: number;
  totalAmountClaimed: number;
}

export interface DirectorDashboardData {
  pendingApprovalCount: number;
  approvedToday: number;
  rejectedToday: number;
  totalPendingAmount: number;
  recentActivity: Voucher[];
}
export interface AccountsDashboardData {
  totalVouchers: number;
  pendingApproval: number;
  approvedVouchers: number;
  rejectedVouchers: number;
  totalApprovedExpenseAmount: number;
  recentApprovedVouchers: Voucher[];
}

export const getEmployeeDashboard = async () => {
  const { data } = await api.get<ApiResponse<EmployeeDashboardData>>(
    "/dashboard/employee",
  );
  return data.data;
};

export const getDirectorDashboard = async () => {
  const { data } = await api.get<ApiResponse<DirectorDashboardData>>(
    "/dashboard/director",
  );
  return data.data;
};

export const getAccountsDashboard = async () => {
  const { data } = await api.get<ApiResponse<AccountsDashboardData>>(
    "/dashboard/accounts",
  );
  return data.data;
};
