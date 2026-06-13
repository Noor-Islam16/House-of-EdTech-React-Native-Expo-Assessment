import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface PreferenceState {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  setTheme: (theme: "light" | "dark") => Promise<void>;
  toggleNotifications: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const usePreferenceStore = create<PreferenceState>((set, get) => ({
  theme: "light",
  notificationsEnabled: true,

  setTheme: async (theme) => {
    set({ theme });
    await AsyncStorage.setItem("theme", theme);
  },

  toggleNotifications: async () => {
    const val = !get().notificationsEnabled;
    set({ notificationsEnabled: val });
    await AsyncStorage.setItem("notifications", JSON.stringify(val));
  },

  hydrate: async () => {
    try {
      const [theme, notif] = await Promise.all([
        AsyncStorage.getItem("theme"),
        AsyncStorage.getItem("notifications"),
      ]);
      set({
        theme: (theme as "light" | "dark") ?? "light",
        notificationsEnabled: notif ? (JSON.parse(notif) as boolean) : true,
      });
    } catch {
      // ignore
    }
  },
}));
