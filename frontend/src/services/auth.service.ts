import api from "./api";
import type { ApiResponse, LoginResponse, User } from "@/types";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "employee" | "director" | "accounts";
  employeeId?: string;
  department?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse<User>>("/auth/register", payload);
  return data.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload,
  );
  return data.data;
};

export const logoutUser = async () => {
  const { data } = await api.post<ApiResponse<object>>("/auth/logout");
  return data.data;
};
