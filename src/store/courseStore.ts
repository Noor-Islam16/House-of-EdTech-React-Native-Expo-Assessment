import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Course } from "@src/types";
import { create } from "zustand";

interface CourseState {
  courses: Course[];
  bookmarks: string[]; // course ids
  enrollments: string[]; // course ids
  setCourses: (courses: Course[]) => void;
  toggleBookmark: (id: string) => Promise<void>;
  enroll: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrollments: [],

  setCourses: (courses) => set({ courses }),

  toggleBookmark: async (id) => {
    const { bookmarks } = get();
    const updated = bookmarks.includes(id)
      ? bookmarks.filter((b) => b !== id)
      : [...bookmarks, id];
    set({ bookmarks: updated });
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updated));
  },

  enroll: async (id) => {
    const { enrollments } = get();
    if (enrollments.includes(id)) return;
    const updated = [...enrollments, id];
    set({ enrollments: updated });
    await AsyncStorage.setItem("enrollments", JSON.stringify(updated));
  },

  hydrate: async () => {
    try {
      const [bRaw, eRaw] = await Promise.all([
        AsyncStorage.getItem("bookmarks"),
        AsyncStorage.getItem("enrollments"),
      ]);
      set({
        bookmarks: bRaw ? (JSON.parse(bRaw) as string[]) : [],
        enrollments: eRaw ? (JSON.parse(eRaw) as string[]) : [],
      });
    } catch {
      // ignore
    }
  },
}));
