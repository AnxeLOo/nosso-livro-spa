export type ReadingStatus = 'none' | 'reading' | 'completed' | 'wishlist';

export interface Book {
  id: string; // Open Library key or ID, e.g. OL12345W or works/OL12345W
  key: string;
  title: string;
  author: string;
  firstPublishYear?: number;
  coverId?: number;
  coverUrl?: string;
  category: string;
  subjects?: string[];
  description?: string;
  pageCount?: number;
  publisher?: string;
  isbn?: string;
  // Local university library metadata
  totalCopies: number;
  availableCopies: number;
  isSaved?: boolean;
  readingStatus?: ReadingStatus;
  distanceKm?: number;
  ownerName?: string;
  ownerInitials?: string;
}

export interface OpenLibrarySearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
  publisher?: string[];
  isbn?: string[];
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  docs: OpenLibrarySearchDoc[];
}

export interface OpenLibraryWorkResponse {
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
  key: string;
}

export type CategoryFilter = 'all' | 'fiction' | 'science' | 'history' | 'classic' | 'personal' | 'technology';

export type SortOption = 'relevance' | 'newest' | 'oldest' | 'title' | 'author';
