import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Course } from "@src/types";
import { create } from "zustand";

interface CourseState {
  courses: Course[];
  bookmarks: string[];
  enrollments: string[];
  completedCourses: string[];
  setCourses: (courses: Course[]) => void;
  toggleBookmark: (id: string) => Promise<void>;
  enroll: (id: string) => Promise<void>;
  completeCourse: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  bookmarks: [],
  enrollments: [],
  completedCourses: [],

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

  completeCourse: async (id) => {
    const { completedCourses } = get();
    if (completedCourses.includes(id)) return;
    const updated = [...completedCourses, id];
    set({ completedCourses: updated });
    await AsyncStorage.setItem("completedCourses", JSON.stringify(updated));
  },

  hydrate: async () => {
    try {
      const [bRaw, eRaw, cRaw] = await Promise.all([
        AsyncStorage.getItem("bookmarks"),
        AsyncStorage.getItem("enrollments"),
        AsyncStorage.getItem("completedCourses"),
      ]);
      set({
        bookmarks: bRaw ? (JSON.parse(bRaw) as string[]) : [],
        enrollments: eRaw ? (JSON.parse(eRaw) as string[]) : [],
        completedCourses: cRaw ? (JSON.parse(cRaw) as string[]) : [],
      });
    } catch {
      // ignore
    }
  },
}));
