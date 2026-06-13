import type { Course, Instructor } from "@src/types";
import { apiClient } from "./client";

interface RandomUsersResponse {
  data: {
    results: Array<{
      login: { uuid: string };
      name: { first: string; last: string };
      picture: { large: string };
    }>;
  };
}

interface RandomProductsResponse {
  data: {
    data: Array<{
      id: number;
      title: string;
      description: string;
      thumbnail: string;
      price: number;
      category: string;
    }>;
  };
}

export const courseApi = {
  getInstructors: async (): Promise<Instructor[]> => {
    const res = await apiClient.get<RandomUsersResponse>(
      "/api/v1/public/randomusers?limit=20",
    );
    return res.data.data.results.map((u) => ({
      id: u.login.uuid,
      firstName: u.name.first,
      lastName: u.name.last,
      avatar: u.picture.large,
    }));
  },

  getCourses: async (): Promise<Course[]> => {
    const [productsRes, instructorsRes] = await Promise.all([
      apiClient.get<RandomProductsResponse>(
        "/api/v1/public/randomproducts?limit=20",
      ),
      courseApi.getInstructors(),
    ]);

    return productsRes.data.data.data.map((p, i) => ({
      id: String(p.id),
      title: p.title,
      description: p.description,
      thumbnail: p.thumbnail,
      price: p.price,
      category: p.category,
      instructor: instructorsRes[i % instructorsRes.length],
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    }));
  },
};
