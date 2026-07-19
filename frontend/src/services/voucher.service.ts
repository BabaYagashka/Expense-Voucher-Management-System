import api from "./api";
import type { ApiResponse, Voucher } from "@/types";

export interface CreateVoucherPayload {
  expenseDate: string;
  department: string;
  expenseTitle: string;
  expenseCategory: string;
  expenseDescription?: string;
  amount: number;
}

export const getMyVouchers = async () => {
  const { data } = await api.get<ApiResponse<Voucher[]>>(
    "/vouchers/my-vouchers",
  );
  return data.data;
};

export const createVoucher = async (payload: CreateVoucherPayload) => {
  const { data } = await api.post<ApiResponse<Voucher>>("/vouchers", payload);
  return data.data;
};

export const getVoucherById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Voucher>>(`/vouchers/${id}`);
  return data.data;
};

export const updateVoucher = async (
  id: string,
  payload: Partial<CreateVoucherPayload>,
) => {
  const { data } = await api.patch<ApiResponse<Voucher>>(
    `/vouchers/${id}`,
    payload,
  );
  return data.data;
};

export const deleteVoucher = async (id: string) => {
  const { data } = await api.delete<ApiResponse<object>>(`/vouchers/${id}`);
  return data.data;
};

export const submitVoucher = async (id: string, signatureFile: File) => {
  const formData = new FormData();
  formData.append("employeeSignature", signatureFile);
  const { data } = await api.patch<ApiResponse<Voucher>>(
    `/vouchers/${id}/submit`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

export const approveVoucher = async (id: string, signatureFile: File) => {
  const formData = new FormData();
  formData.append("directorSignature", signatureFile);
  const { data } = await api.patch<ApiResponse<Voucher>>(
    `/vouchers/${id}/approve`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.data;
};

export const rejectVoucher = async (id: string, rejectionReason: string) => {
  const { data } = await api.patch<ApiResponse<Voucher>>(
    `/vouchers/${id}/reject`,
    {
      rejectionReason,
    },
  );
  return data.data;
};

export const getAllVouchers = async (params?: Record<string, string>) => {
  const { data } = await api.get<ApiResponse<Voucher[]>>("/vouchers", {
    params,
  });
  return data.data;
};
