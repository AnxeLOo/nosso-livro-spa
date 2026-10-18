export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },
};
