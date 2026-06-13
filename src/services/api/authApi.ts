import type { AuthTokens, User } from "@src/types";
import { apiClient } from "./client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/v1/users/login", payload);
    return res.data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/v1/users/register", payload);
    return res.data.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get("/api/v1/users/current-user");
    return res.data.data;
  },

  updateAvatar: async (formData: FormData): Promise<User> => {
    const res = await apiClient.patch("/api/v1/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
