import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '../store/bookStore';
import { useSearchModalStore } from '../store/searchModalStore';
import { CategoryFilterBar } from '../components/CategoryFilterBar';
import { BookCard } from '../components/BookCard';
import { Search, ArrowLeft, Loader2, RefreshCw, BookOpen } from 'lucide-react';
import { CategoryFilter, SortOption } from '../types/book';

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = (searchParams.get('category') as CategoryFilter) || 'all';

  const {
    books,
    isLoading,
    error,
    selectedCategory,
    selectedSort,
    setSearchQuery,
    setSelectedCategory,
    setSelectedSort,
    fetchBooks,
    loadMoreBooks,
    totalFound,
  } = useBookStore();

  const { openSearchModal } = useSearchModalStore();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Sync URL search params with store and fetch books
  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
    fetchBooks(true);
  }, [queryParam, categoryParam]);

  const handleCategorySelect = (category: CategoryFilter) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSortSelect = (sort: SortOption) => {
    setSelectedSort(sort);
    fetchBooks(true);
  };

  return (
    <div className="animate-fade-in search-results-page">
      <button
        type="button"
        onClick={handleBack}
        className="secondary-button"
        style={{ marginBottom: '20px', minHeight: '38px', padding: '0 14px' }}
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      {/* Query Title & Meta */}
      <section className="search-title-section">
        <span className="eyebrow">RESULTADOS DA BUSCA</span>
        <h1 style={{ margin: '8px 0 6px', fontSize: 'clamp(26px, 5vw, 38px)', letterSpacing: '-1.2px', fontWeight: 750 }}>
          {queryParam ? (
            <>
              Livros sobre <span style={{ color: 'var(--red)' }}>"{queryParam}"</span>
            </>
          ) : (
            'Todos os Livros'
          )}
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>
          {isLoading && books.length === 0
            ? 'Buscando obras disponíveis na Open Library...'
            : totalFound > 0
              ? `${totalFound.toLocaleString()} obra${totalFound === 1 ? '' : 's'} encontrada${totalFound === 1 ? '' : 's'}`
              : 'Nenhum resultado registrado'}
        </p>
      </section>

      {/* Category and Sort Filters */}
      <section style={{ margin: '20px 0 24px' }}>
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          selectedSort={selectedSort}
          onSelectSort={handleSortSelect}
        />
      </section>

      {/* Error state */}
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

      {/* Loading state */}
      {isLoading && books.length === 0 ? (
        <div className="empty-state">
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
          <p style={{ margin: 0 }}>Consultando catálogo da biblioteca...</p>
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div style={{ textAlign: 'center', margin: '36px 0 60px' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={loadMoreBooks}
              disabled={isLoading}
              style={{ minWidth: '190px' }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Carregando mais...
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
            <p style={{ margin: '0 0 6px', fontWeight: 650, fontSize: '15px' }}>
              Nenhum livro encontrado para "{queryParam}".
            </p>
            <p style={{ margin: '0 0 18px', fontSize: '13px' }}>
              Verifique a ortografia do título ou autor, tente palavras-chave mais genéricas ou selecione outra categoria.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="primary-button"
                style={{ width: 'auto' }}
                onClick={() => openSearchModal({ query: queryParam, category: selectedCategory })}
              >
                <Search size={15} />
                Fazer nova busca
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
