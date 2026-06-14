import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (user, token) => {
    await SecureStore.setItemAsync("accessToken", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("user");
    await AsyncStorage.multiRemove(["bookmarks", "enrollments"]);
    const { useCourseStore } = await import("./courseStore");
    useCourseStore.setState({ bookmarks: [], enrollments: [] });
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const userStr = await SecureStore.getItemAsync("user");
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      }
    } catch {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("user");
    } finally {
      set({ isLoading: false });
    }
  },
}));
