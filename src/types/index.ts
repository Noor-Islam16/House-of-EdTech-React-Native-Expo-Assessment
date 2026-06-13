export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  instructor: Instructor;
  rating?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export type RootStackParamList = {
  "(auth)/login": undefined;
  "(auth)/register": undefined;
  "(tabs)": undefined;
  "course/[id]": { id: string };
};
