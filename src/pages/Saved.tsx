import React from 'react';
import { Link } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { BookCard } from '../components/BookCard';
import { Bookmark, ArrowRight } from 'lucide-react';

export const Saved: React.FC = () => {
  const { savedBooks } = useBookStore();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <section style={{ marginBottom: '24px' }}>
        <span className="eyebrow">LEITURAS FUTURAS &bull; FAVORITOS</span>
        <h1 style={{ margin: '8px 0 6px', fontSize: '28px', fontWeight: 750, letterSpacing: '-0.7px' }}>
          Livros Salvos
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>
          Sua lista pessoal de interesses e leituras planejadas na biblioteca universitária.
        </p>
      </section>

      {savedBooks.length === 0 ? (
        <div className="empty-state">
          <Bookmark size={36} />
          <p style={{ margin: 0, fontWeight: 600 }}>Sua lista de livros salvos está vazia.</p>
          <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
            Ao explorar o catálogo, clique no ícone de marcador para salvar livros para ler mais tarde.
          </p>
          <Link to="/" className="primary-button" style={{ width: 'auto', padding: '0 20px', display: 'inline-flex' }}>
            Explorar Catálogo
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px', color: 'var(--muted)', fontSize: '13px' }}>
            Você possui <strong>{savedBooks.length}</strong> livro(s) salvo(s):
          </div>
          <div className="books-grid">
            {savedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
