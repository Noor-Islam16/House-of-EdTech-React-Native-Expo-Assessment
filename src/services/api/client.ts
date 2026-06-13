import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://api.freeapi.app";
const TIMEOUT = 10000;
const MAX_RETRIES = 3;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach token
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — retry logic
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    config._retryCount = config._retryCount ?? 0;

    if (config._retryCount < MAX_RETRIES && !error.response) {
      config._retryCount += 1;
      await new Promise((r) => setTimeout(r, 1000 * config._retryCount));
      return apiClient(config);
    }

    return Promise.reject(error);
  },
);
