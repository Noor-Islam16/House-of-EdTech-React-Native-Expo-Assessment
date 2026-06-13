import type { AuthTokens, User } from "@src/types";
import { apiClient } from "./client";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
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
    const d = res.data.data;
    return {
      user: {
        id: d.user._id,
        name: d.user.username,
        email: d.user.email,
        avatar: d.user.avatar?.url,
      },
      tokens: {
        accessToken: d.accessToken,
        refreshToken: d.refreshToken,
      },
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/v1/users/register", payload);
    const d = res.data.data;
    return {
      user: {
        id: d.user?._id ?? d._id,
        name: d.user?.username ?? d.username,
        email: d.user?.email ?? d.email,
        avatar: d.user?.avatar?.url ?? d.avatar?.url,
      },
      tokens: {
        accessToken: d.accessToken ?? "",
        refreshToken: d.refreshToken,
      },
    };
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get("/api/v1/users/current-user");
    const d = res.data.data;
    return {
      id: d._id,
      name: d.username,
      email: d.email,
      avatar: d.avatar?.url,
    };
  },

  updateAvatar: async (formData: FormData): Promise<User> => {
    const res = await apiClient.patch("/api/v1/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const d = res.data.data;
    return {
      id: d._id,
      name: d.username,
      email: d.email,
      avatar: d.avatar?.url,
    };
  },
};
