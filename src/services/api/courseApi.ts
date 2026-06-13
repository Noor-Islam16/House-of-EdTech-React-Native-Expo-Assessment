import type { Course, Instructor } from "@src/types";
import { apiClient } from "./client";

export const courseApi = {
  getInstructors: async (): Promise<Instructor[]> => {
    const res = await apiClient.get("/api/v1/public/randomusers?limit=20");
    const results = res.data.data.data; // data.data.data = array
    return results.map((u: any) => ({
      id: u.login.uuid,
      firstName: u.name.first,
      lastName: u.name.last,
      avatar: u.picture.large,
    }));
  },

  getCourses: async (): Promise<Course[]> => {
    const [productsRes, instructors] = await Promise.all([
      apiClient.get("/api/v1/public/randomproducts?limit=20"),
      courseApi.getInstructors(),
    ]);

    // shape: res.data.data.data = array
    const products = productsRes.data.data.data as any[];

    // map product → course (treat as LMS course)
    const COURSE_THUMBNAILS = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400",
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400",
      "https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=400",
      "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    ];
    const COURSE_CATEGORIES = [
      "React Native",
      "Flutter",
      "Backend",
      "UI/UX",
      "AI",
      "Cloud",
      "React Native",
      "Flutter",
      "Backend",
      "UI/UX",
    ];

    // inside getCourses map:
    return products.map((p: any, i: number) => ({
      id: String(p.id),
      title: p.title,
      description: `Master ${p.title} with hands-on projects and real-world examples.`,
      thumbnail: COURSE_THUMBNAILS[i % COURSE_THUMBNAILS.length],
      price: p.price,
      category: COURSE_CATEGORIES[i % COURSE_CATEGORIES.length],
      instructor: instructors[i % instructors.length],
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    }));
  },
};
