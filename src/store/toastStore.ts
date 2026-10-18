import { create } from 'zustand';

interface ToastState {
  message: string | null;
  isVisible: boolean;
  showToast: (message: string, durationMs?: number) => void;
  hideToast: () => void;
}

let toastTimeout: NodeJS.Timeout | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  isVisible: false,
  showToast: (message: string, durationMs = 3200) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    set({ message, isVisible: true });
    toastTimeout = setTimeout(() => {
      set({ isVisible: false });
    }, durationMs);
  },
  hideToast: () => {
    if (toastTimeout) clearTimeout(toastTimeout);
    set({ isVisible: false });
  },
}));
