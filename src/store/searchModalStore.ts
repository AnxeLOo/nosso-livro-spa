import { create } from 'zustand';
import { CategoryFilter } from '../types/book';

interface SearchModalState {
  isOpen: boolean;
  initialQuery: string;
  initialCategory: CategoryFilter;
  openSearchModal: (params?: { query?: string; category?: CategoryFilter }) => void;
  closeSearchModal: () => void;
}

export const useSearchModalStore = create<SearchModalState>((set) => ({
  isOpen: false,
  initialQuery: '',
  initialCategory: 'all',

  openSearchModal: (params) => {
    set({
      isOpen: true,
      initialQuery: params?.query ?? '',
      initialCategory: params?.category ?? 'all',
    });
  },

  closeSearchModal: () => {
    set({ isOpen: false });
  },
}));
