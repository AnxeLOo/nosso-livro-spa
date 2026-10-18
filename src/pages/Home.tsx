import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { BookCard } from '../components/BookCard';
import { Sparkles, ArrowRight, BookOpen, Loader2, RefreshCw } from 'lucide-react';
import { CategoryFilter, SortOption } from '../types/book';
import { CATEGORY_LABELS } from '../services/openLibrary';

export const Home: React.FC = () => {
  const {
    books,
    isLoading,
    error,
    selectedCategory,
    selectedSort,
    currentPage,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSort,
    fetchBooks,
    loadMoreBooks,
    totalFound,
  } = useBookStore();

  // Initial load
  useEffect(() => {
    setSearchQuery('');
    fetchBooks(true);
  }, []);

  const handleCategorySelect = (category: CategoryFilter) => {
    setSelectedCategory(category);
    fetchBooks(true);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSelectedSort(sort);
    fetchBooks(true);
  };

  // Featured book is the first book of the active category
  const featuredBook = books[0];
  const isReloading = isLoading && (currentPage === 1 || books.length === 0);
  const categoryLabel = CATEGORY_LABELS[selectedCategory] || 'Geral';
  const badgeText = selectedCategory === 'all' ? 'Destaque Acadêmico' : `Destaque • ${categoryLabel}`;
  const categoryDescription =
    selectedCategory === 'all'
      ? 'Uma das obras mais recomendadas para pesquisa e estudos no campus neste semestre.'
      : `Uma das principais referências em ${categoryLabel.toLowerCase()} recomendadas no campus neste semestre.`;

  return (
    <div className="animate-fade-in">
      <section className="hero">
        <span className="eyebrow">ACERVO UNIVERSITÁRIO &bull; OPEN LIBRARY</span>
        <h1 style={{ margin: '10px 0 8px', maxWidth: '620px', fontSize: 'clamp(32px, 6vw, 48px)', lineHeight: 1.05, letterSpacing: '-1.8px', fontWeight: 750 }}>
          Descubra sua próxima <span style={{ color: 'var(--red)' }}>leitura</span>.
        </h1>
        <p style={{ margin: 0, maxWidth: '520px', color: '#b8b5ba', fontSize: '14px', lineHeight: 1.55 }}>
          Conecte-se ao acervo da biblioteca universitária integrado em tempo real à Open Library. Consulte disponibilidade, empreste exemplares ou faça reservas online.
        </p>
      </section>

      {/* Feature Card: permanece sempre visível na Home com Skeleton e Fallback */}
      {isReloading ? (
        <section className="feature-card feature-card-skeleton" aria-label="Carregando livro em destaque" aria-busy="true">
          <div className="feature-content">
            <div className="feature-skeleton-pill shimmer-anim" />
            <div className="feature-skeleton-title shimmer-anim" />
            <div className="feature-skeleton-text shimmer-anim" />
            <div className="feature-skeleton-text short shimmer-anim" />
            <div className="feature-skeleton-btn shimmer-anim" />
          </div>
          <div className="feature-book-cover feature-skeleton-cover shimmer-anim" />
        </section>
      ) : featuredBook ? (
        <section className="feature-card" aria-label="Livro em destaque">
          <div className="feature-content">
            <span className="pill">
              <Sparkles size={12} />
              {badgeText}
            </span>
            <h3>{featuredBook.title}</h3>
            <p>
              Por {featuredBook.author}. {categoryDescription}
            </p>
            <div>
              <Link
                to={`/book/${featuredBook.id}`}
                className="primary-button"
                style={{ width: 'auto', padding: '0 20px', display: 'inline-flex' }}
              >
                Ver Detalhes & Empréstimo
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="feature-book-cover">
            {featuredBook.coverUrl ? (
              <img src={featuredBook.coverUrl} alt={featuredBook.title} loading="lazy" />
            ) : (
              <div style={{ background: 'linear-gradient(145deg,#ff5b50,#b81628)', width: '100%', height: '100%', display: 'grid', placeItems: 'center', padding: '12px', textAlign: 'center', fontSize: '11px' }}>
                {featuredBook.title}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="feature-card" aria-label="Acervo da Biblioteca">
          <div className="feature-content">
            <span className="pill">
              <Sparkles size={12} />
              Acervo Universitário
            </span>
            <h3>Acervo &amp; Pesquisa Acadêmica</h3>
            <p>
              Explore milhares de obras físicas e digitais integradas à Open Library. Alterne as categorias ou reinicie os filtros para descobrir novos títulos.
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  fetchBooks(true);
                }}
                className="primary-button"
                style={{ width: 'auto', padding: '0 20px', display: 'inline-flex' }}
              >
                Ver Todo o Acervo
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="feature-book-cover">
            <div
              style={{
                background: 'linear-gradient(145deg, #ff5b50, #b81628)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                textAlign: 'center',
                gap: '8px',
              }}
            >
              <BookOpen size={28} color="#fff" />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#fff' }}>
                Nosso Livro
              </span>
            </div>
          </div>
        </section>
      )}

      <section id="books-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.5px' }}>
              Catálogo de Livros
            </h2>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '12px' }}>
              {totalFound > 0 ? `${totalFound.toLocaleString()} obras catalogadas` : 'Explorando catálogo'}
            </p>
          </div>
        </div>

        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          selectedSort={selectedSort}
          onSelectSort={handleSortSelect}
        />

        {error && (
          <div className="empty-state" style={{ borderColor: 'rgba(255, 69, 58, 0.4)' }}>
            <p style={{ color: '#ff9d97', margin: '0 0 12px' }}>{error}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => fetchBooks(true)}
              style={{ margin: '0 auto' }}
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        )}

        {isLoading && books.length === 0 ? (
          <div className="empty-state">
            <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p style={{ margin: 0 }}>Consultando Open Library API...</p>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={loadMoreBooks}
                disabled={isLoading}
                style={{ minWidth: '180px' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Carregando...
                  </>
                ) : (
                  'Carregar Mais Livros'
                )}
              </button>
            </div>
          </>
        ) : (
          !isLoading && (
            <div className="empty-state">
              <BookOpen size={36} />
              <p style={{ margin: 0, fontWeight: 650 }}>Nenhum livro encontrado para este critério.</p>
              <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
                Tente alterar a categoria ou utilizar a busca pelo catálogo.
              </p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSelectedCategory('all');
                  fetchBooks(true);
                }}
              >
                Limpar filtros
              </button>
            </div>
          )
        )}
      </section>

      <aside
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '18px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface)',
          border: '1px solid var(--stroke)',
          marginTop: '20px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 69, 58, 0.15)',
            color: 'var(--red-light)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <BookOpen size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
            Tem livros acadêmicos para doar ou compartilhar?
          </strong>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Fortaleça a rede de estudantes compartilhando materiais didáticos com a comunidade da universidade.
          </span>
        </div>
      </aside>
    </div>
  );
};
