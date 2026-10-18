import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types/book';
import { useBookStore } from '../store/bookStore';
import { useLoanStore } from '../store/loanStore';
import { useToastStore } from '../store/toastStore';
import { Bookmark } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { toggleSaveBook, isBookSaved } = useBookStore();
  const { getAvailableCopies } = useLoanStore();
  const { showToast } = useToastStore();

  const saved = isBookSaved(book.id);
  const availableCopies = getAvailableCopies(book.id, book.totalCopies);
  const isAvailable = availableCopies > 0;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSaveBook(book);
    showToast(isNowSaved ? `"${book.title}" salvo na sua lista.` : `"${book.title}" removido dos salvos.`);
  };

  // Generate placeholder background gradient based on title hash if no cover
  const gradients = [
    'linear-gradient(145deg, #431b23, #1e1319)',
    'linear-gradient(145deg, #1b2f3d, #141c22)',
    'linear-gradient(145deg, #372338, #1c151e)',
    'linear-gradient(145deg, #372e1f, #1b1712)',
    'linear-gradient(145deg, #1f352e, #131d18)',
  ];
  const hash = Math.abs(book.title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const gradient = gradients[hash % gradients.length];

  return (
    <article className="book-card">
      <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="book-art" style={{ background: gradient }}>
          <span
            className={`availability-dot ${!isAvailable ? 'unavailable' : ''}`}
            title={isAvailable ? `${availableCopies} exemplar(es) disponível(is)` : 'Esgotado - Disponível para Reserva'}
          />

          <button
            className="save-button"
            type="button"
            aria-label={saved ? `Remover ${book.title} dos salvos` : `Salvar ${book.title}`}
            aria-pressed={saved}
            onClick={handleSaveToggle}
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.8} />
          </button>

          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`Capa do livro ${book.title}`}
              loading="lazy"
              onError={(e) => {
                // If Open Library cover fails to load, hide image to reveal fallback typography
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}

          <div className="book-art-placeholder">
            <small>{book.firstPublishYear ? `Edição ${book.firstPublishYear}` : 'LIVRO UNIVERSITÁRIO'}</small>
            <strong>{book.title}</strong>
            <em>{book.author}</em>
          </div>
        </div>

        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        <p className="book-author" title={book.author}>
          {book.author}
        </p>

        <div className="book-meta">
          <span className={`book-copies-badge ${isAvailable ? 'available' : 'empty'}`}>
            {isAvailable ? `${availableCopies}/${book.totalCopies} disp.` : 'Reservar'}
          </span>
          {book.ownerName && (
            <span style={{ color: 'var(--muted)', fontSize: '11px' }}>
              {book.distanceKm ? `${book.distanceKm} km` : book.ownerName}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
};
