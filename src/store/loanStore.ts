import { create } from 'zustand';
import { Loan, Reservation } from '../types/loan';
import { storage } from '../utils/storage';
import { Book } from '../types/book';

const STORAGE_LOANS_KEY = 'nosso_livro_loans';
const STORAGE_RESERVATIONS_KEY = 'nosso_livro_reservations';

const DEFAULT_LOAN_DAYS = Number(import.meta.env.VITE_DEFAULT_LOAN_DAYS || 14);

interface LoanState {
  loans: Loan[];
  reservations: Reservation[];
  borrowBook: (book: Book, userId: string, userName: string) => { success: boolean; error?: string; loan?: Loan };
  returnBook: (loanId: string) => { success: boolean; message?: string };
  renewLoan: (loanId: string) => { success: boolean; message?: string };
  reserveBook: (book: Book, userId: string, userName: string) => { success: boolean; error?: string; reservation?: Reservation };
  cancelReservation: (reservationId: string) => void;
  getUserLoans: (userId: string) => Loan[];
  getUserReservations: (userId: string) => Reservation[];
  isBookBorrowedByUser: (bookId: string, userId: string) => boolean;
  isBookReservedByUser: (bookId: string, userId: string) => boolean;
  getAvailableCopies: (bookId: string, defaultTotalCopies: number) => number;
}

const initialLoans = storage.get<Loan[]>(STORAGE_LOANS_KEY, [
  // Seed an initial active loan for demonstration
  {
    id: 'loan_seed_1',
    bookId: 'OL12345W',
    bookTitle: 'A vida invisível de Addie LaRue',
    bookAuthor: 'V. E. Schwab',
    bookCoverUrl: undefined,
    bookCategory: 'fiction',
    userId: 'usr_student_1',
    userName: 'Lucas Mendes',
    borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    dueAt: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    renewCount: 0,
  },
]);

const initialReservations = storage.get<Reservation[]>(STORAGE_RESERVATIONS_KEY, []);

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: initialLoans,
  reservations: initialReservations,

  borrowBook: (book: Book, userId: string, userName: string) => {
    const { loans, getAvailableCopies, isBookBorrowedByUser } = get();

    if (isBookBorrowedByUser(book.id, userId)) {
      return { success: false, error: 'Você já possui um empréstimo ativo deste exemplar.' };
    }

    const available = getAvailableCopies(book.id, book.totalCopies);
    if (available <= 0) {
      return { success: false, error: 'Exemplar sem cópias disponíveis no momento. Deseja realizar uma reserva?' };
    }

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + DEFAULT_LOAN_DAYS);

    const newLoan: Loan = {
      id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCoverUrl: book.coverUrl,
      bookCategory: book.category,
      userId,
      userName,
      borrowedAt: now.toISOString(),
      dueAt: dueDate.toISOString(),
      status: 'active',
      renewCount: 0,
    };

    const updatedLoans = [newLoan, ...loans];
    storage.set(STORAGE_LOANS_KEY, updatedLoans);
    set({ loans: updatedLoans });

    return { success: true, loan: newLoan };
  },

  returnBook: (loanId: string) => {
    const { loans, reservations } = get();
    const loanIndex = loans.findIndex((l) => l.id === loanId);
    if (loanIndex === -1) return { success: false, message: 'Empréstimo não encontrado.' };

    const targetLoan = loans[loanIndex];
    const updatedLoan: Loan = {
      ...targetLoan,
      status: 'returned',
      returnedAt: new Date().toISOString(),
    };

    const updatedLoans = [...loans];
    updatedLoans[loanIndex] = updatedLoan;
    storage.set(STORAGE_LOANS_KEY, updatedLoans);

    // Notify or update first reservation in queue if any exists for this book
    const bookResIndex = reservations.findIndex(
      (r) => r.bookId === targetLoan.bookId && r.status === 'waiting'
    );
    let updatedReservations = reservations;
    if (bookResIndex !== -1) {
      updatedReservations = [...reservations];
      updatedReservations[bookResIndex] = {
        ...updatedReservations[bookResIndex],
        status: 'ready',
      };
      storage.set(STORAGE_RESERVATIONS_KEY, updatedReservations);
    }

    set({ loans: updatedLoans, reservations: updatedReservations });
    return { success: true, message: 'Livro devolvido à biblioteca com sucesso!' };
  },

  renewLoan: (loanId: string) => {
    const { loans } = get();
    const loanIndex = loans.findIndex((l) => l.id === loanId);
    if (loanIndex === -1) return { success: false, message: 'Empréstimo não encontrado.' };

    const loan = loans[loanIndex];
    if (loan.renewCount >= 2) {
      return { success: false, message: 'Limite máximo de renovações atingido (2 vezes).' };
    }

    const currentDue = new Date(loan.dueAt);
    currentDue.setDate(currentDue.getDate() + 7); // +7 days renewal

    const updatedLoan: Loan = {
      ...loan,
      dueAt: currentDue.toISOString(),
      renewCount: loan.renewCount + 1,
    };

    const updatedLoans = [...loans];
    updatedLoans[loanIndex] = updatedLoan;
    storage.set(STORAGE_LOANS_KEY, updatedLoans);
    set({ loans: updatedLoans });

    return { success: true, message: `Prazo renovado com sucesso! Nova data: ${currentDue.toLocaleDateString('pt-BR')}` };
  },

  reserveBook: (book: Book, userId: string, userName: string) => {
    const { reservations, isBookReservedByUser } = get();

    if (isBookReservedByUser(book.id, userId)) {
      return { success: false, error: 'Você já possui uma reserva ativa para este livro.' };
    }

    const currentBookReservations = reservations.filter(
      (r) => r.bookId === book.id && (r.status === 'waiting' || r.status === 'ready')
    );

    const newReservation: Reservation = {
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCoverUrl: book.coverUrl,
      userId,
      userName,
      queuePosition: currentBookReservations.length + 1,
      reservedAt: new Date().toISOString(),
      status: 'waiting',
    };

    const updatedReservations = [...reservations, newReservation];
    storage.set(STORAGE_RESERVATIONS_KEY, updatedReservations);
    set({ reservations: updatedReservations });

    return { success: true, reservation: newReservation };
  },

  cancelReservation: (reservationId: string) => {
    const { reservations } = get();
    const updated = reservations.filter((r) => r.id !== reservationId);
    storage.set(STORAGE_RESERVATIONS_KEY, updated);
    set({ reservations: updated });
  },

  getUserLoans: (userId: string) => {
    return get().loans.filter((l) => l.userId === userId);
  },

  getUserReservations: (userId: string) => {
    return get().reservations.filter((r) => r.userId === userId);
  },

  isBookBorrowedByUser: (bookId: string, userId: string) => {
    return get().loans.some((l) => l.bookId === bookId && l.userId === userId && l.status === 'active');
  },

  isBookReservedByUser: (bookId: string, userId: string) => {
    return get().reservations.some(
      (r) => r.bookId === bookId && r.userId === userId && (r.status === 'waiting' || r.status === 'ready')
    );
  },

  getAvailableCopies: (bookId: string, defaultTotalCopies: number) => {
    const activeLoansCount = get().loans.filter(
      (l) => l.bookId === bookId && l.status === 'active'
    ).length;
    return Math.max(0, defaultTotalCopies - activeLoansCount);
  },
}));
