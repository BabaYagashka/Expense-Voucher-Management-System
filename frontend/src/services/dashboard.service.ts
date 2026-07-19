import api from "./api";
import type { ApiResponse } from "@/types";

export interface EmployeeDashboardData {
  totalVouchers: number;
  draftVouchers: number;
  pendingApproval: number;
  approvedVouchers: number;
  rejectedVouchers: number;
  totalAmountClaimed: number;
}

export const getEmployeeDashboard = async () => {
  const { data } = await api.get<ApiResponse<EmployeeDashboardData>>(
    "/dashboard/employee",
  );
  return data.data;
};
