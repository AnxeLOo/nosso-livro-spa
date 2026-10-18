import { create } from 'zustand';
import { Book, CategoryFilter, ReadingStatus, SortOption } from '../types/book';
import { storage } from '../utils/storage';
import { searchBooks } from '../services/openLibrary';

const STORAGE_SAVED_BOOKS_KEY = 'nosso_livro_saved_books';
const STORAGE_READING_STATUS_KEY = 'nosso_livro_reading_status';

interface BookState {
  savedBooks: Book[];
  readingStatuses: Record<string, ReadingStatus>;
  books: Book[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: CategoryFilter;
  selectedSort: SortOption;
  currentPage: number;
  totalFound: number;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: CategoryFilter) => void;
  setSelectedSort: (sort: SortOption) => void;
  fetchBooks: (resetPage?: boolean) => Promise<void>;
  loadMoreBooks: () => Promise<void>;

  toggleSaveBook: (book: Book) => boolean;
  isBookSaved: (bookId: string) => boolean;
  setReadingStatus: (bookId: string, status: ReadingStatus) => void;
  getReadingStatus: (bookId: string) => ReadingStatus;
}

const initialSavedBooks = storage.get<Book[]>(STORAGE_SAVED_BOOKS_KEY, []);
const initialReadingStatuses = storage.get<Record<string, ReadingStatus>>(STORAGE_READING_STATUS_KEY, {});

export const useBookStore = create<BookState>((set, get) => ({
  savedBooks: initialSavedBooks,
  readingStatuses: initialReadingStatuses,
  books: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  selectedSort: 'relevance',
  currentPage: 1,
  totalFound: 0,

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
  },

  setSelectedCategory: (selectedCategory: CategoryFilter) => {
    set({ selectedCategory });
  },

  setSelectedSort: (selectedSort: SortOption) => {
    set({ selectedSort });
  },

  fetchBooks: async (resetPage = true) => {
    const { searchQuery, selectedCategory, selectedSort, currentPage } = get();
    const pageToLoad = resetPage ? 1 : currentPage;

    set({ isLoading: true, error: null });

    try {
      const result = await searchBooks(searchQuery, selectedCategory, selectedSort, pageToLoad, 18);
      set({
        books: resetPage ? result.books : [...get().books, ...result.books],
        totalFound: result.total,
        currentPage: pageToLoad,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: 'Não foi possível carregar os livros da Open Library. Verifique sua conexão e tente novamente.',
      });
    }
  },

  loadMoreBooks: async () => {
    const { currentPage, isLoading, fetchBooks } = get();
    if (isLoading) return;
    set({ currentPage: currentPage + 1 });
    await fetchBooks(false);
  },

  toggleSaveBook: (book: Book) => {
    const { savedBooks } = get();
    const exists = savedBooks.some((b) => b.id === book.id);
    let updated: Book[];

    if (exists) {
      updated = savedBooks.filter((b) => b.id !== book.id);
    } else {
      updated = [{ ...book, isSaved: true }, ...savedBooks];
    }

    storage.set(STORAGE_SAVED_BOOKS_KEY, updated);
    set({ savedBooks: updated });
    return !exists;
  },

  isBookSaved: (bookId: string) => {
    return get().savedBooks.some((b) => b.id === bookId);
  },

  setReadingStatus: (bookId: string, status: ReadingStatus) => {
    const { readingStatuses } = get();
    const updated = { ...readingStatuses, [bookId]: status };
    storage.set(STORAGE_READING_STATUS_KEY, updated);
    set({ readingStatuses: updated });
  },

  getReadingStatus: (bookId: string) => {
    return get().readingStatuses[bookId] || 'none';
  },
}));
