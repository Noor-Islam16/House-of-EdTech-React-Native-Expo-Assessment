import AsyncStorage from "@react-native-async-storage/async-storage";

export const appStorage = {
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // silently fail
    }
  },

  get: async <T>(key: string): Promise<T | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  delete: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // silently fail
    }
  },

  multiGet: async <T>(keys: string[]): Promise<Record<string, T | null>> => {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return Object.fromEntries(
        pairs.map(([k, v]) => [k, v ? (JSON.parse(v) as T) : null]),
      );
    } catch {
      return {};
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch {
      // silently fail
    }
  },
};
