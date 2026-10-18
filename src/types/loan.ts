export type LoanStatus = 'active' | 'returned' | 'overdue';

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl?: string;
  bookCategory?: string;
  userId: string;
  userName: string;
  borrowedAt: string; // ISO date
  dueAt: string; // ISO date (usually +14 days)
  returnedAt?: string;
  status: LoanStatus;
  renewCount: number;
}

export type ReservationStatus = 'waiting' | 'ready' | 'fulfilled' | 'cancelled';

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl?: string;
  userId: string;
  userName: string;
  queuePosition: number;
  reservedAt: string;
  status: ReservationStatus;
}
