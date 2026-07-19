import api from "./api";
import type { ApiResponse, Voucher } from "@/types";

export const getMyVouchers = async () => {
  const { data } = await api.get<ApiResponse<Voucher[]>>(
    "/vouchers/my-vouchers",
  );
  return data.data;
};
