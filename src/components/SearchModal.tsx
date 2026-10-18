import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  CornerDownLeft,
  BookOpen,
  Bookmark,
  Clock,
  Sparkles,
  Cpu,
  History,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { useSearchModalStore } from '../store/searchModalStore';
import { CategoryFilter } from '../types/book';
import { sanitizeInput } from '../utils/sanitize';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: CategoryFilter;
  badge?: string;
  icon: React.ReactNode;
  action: () => void;
  section: string;
}

export const SearchModal: React.FC = () => {
  const { isOpen, initialQuery, initialCategory, closeSearchModal, openSearchModal } = useSearchModalStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(initialCategory);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearchModal();
        } else {
          openSearchModal();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, closeSearchModal, openSearchModal]);

  // Sync state on open/close
  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedCategory(initialCategory);
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, initialQuery, initialCategory]);

  const executeSearch = (q: string, cat?: CategoryFilter) => {
    const trimmed = q.trim();
    closeSearchModal();
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    const effectiveCategory = cat ?? selectedCategory;
    if (effectiveCategory && effectiveCategory !== 'all') {
      params.set('category', effectiveCategory);
    }
    navigate(`/search?${params.toString()}`);
  };

  // Build Raycast Command Palette list items
  const items: PaletteItem[] = useMemo(() => {
    const trimmed = query.trim();

    if (trimmed) {
      const list: PaletteItem[] = [
        {
          id: 'search-main',
          title: `Pesquisar por "${trimmed}"`,
          subtitle: selectedCategory !== 'all' ? `na categoria ${selectedCategory}` : 'em todo o acervo',
          badge: 'Resultados',
          category: selectedCategory,
          icon: <Search size={16} />,
          action: () => executeSearch(trimmed, selectedCategory),
          section: 'AÇÃO PRINCIPAL',
        },
      ];

      const categoryOptions: { id: CategoryFilter; name: string; icon: React.ReactNode }[] = [
        { id: 'fiction', name: 'Ficção & Literatura', icon: <Sparkles size={16} /> },
        { id: 'science', name: 'Ciência & Pesquisa', icon: <Compass size={16} /> },
        { id: 'technology', name: 'Tecnologia & Computação', icon: <Cpu size={16} /> },
        { id: 'history', name: 'História & Filosofia', icon: <History size={16} /> },
        { id: 'classic', name: 'Obras Clássicas', icon: <BookOpen size={16} /> },
        { id: 'personal', name: 'Desenvolvimento Pessoal', icon: <GraduationCap size={16} /> },
      ];

      categoryOptions.forEach((cat) => {
        list.push({
          id: `search-cat-${cat.id}`,
          title: `Buscar "${trimmed}" em ${cat.name}`,
          subtitle: 'Filtrar acervo',
          badge: cat.id,
          category: cat.id,
          icon: cat.icon,
          action: () => executeSearch(trimmed, cat.id),
          section: 'FILTRAR POR CATEGORIA',
        });
      });

      return list;
    }

    // When query is empty, show instant Raycast command palette options
    return [
      {
        id: 'explore-all',
        title: 'Explorar Catálogo Completo',
        subtitle: 'Consultar todas as obras registradas',
        badge: 'Catálogo',
        category: 'all',
        icon: <BookOpen size={16} />,
        action: () => {
          closeSearchModal();
          navigate('/search');
        },
        section: 'AÇÕES RÁPIDAS',
      },
      {
        id: 'nav-saved',
        title: 'Meus Livros Salvos',
        subtitle: 'Acessar obras marcadas para leitura',
        badge: 'Salvos',
        icon: <Bookmark size={16} />,
        action: () => {
          closeSearchModal();
          navigate('/saved');
        },
        section: 'AÇÕES RÁPIDAS',
      },
      {
        id: 'nav-loans',
        title: 'Meus Empréstimos Ativos',
        subtitle: 'Ver prazos de devolução e reservas',
        badge: 'Empréstimos',
        icon: <Clock size={16} />,
        action: () => {
          closeSearchModal();
          navigate('/loans');
        },
        section: 'AÇÕES RÁPIDAS',
      },
      // Categories
      {
        id: 'cat-fiction',
        title: 'Ficção & Narrativas',
        subtitle: 'Romances, contos e fantasia',
        badge: 'Ficção',
        category: 'fiction',
        icon: <Sparkles size={16} />,
        action: () => executeSearch('', 'fiction'),
        section: 'CATEGORIAS DO ACERVO',
      },
      {
        id: 'cat-science',
        title: 'Ciência & Pesquisa',
        subtitle: 'Artigos, tratados e publicações acadêmicas',
        badge: 'Ciência',
        category: 'science',
        icon: <Compass size={16} />,
        action: () => executeSearch('', 'science'),
        section: 'CATEGORIAS DO ACERVO',
      },
      {
        id: 'cat-technology',
        title: 'Tecnologia & Computação',
        subtitle: 'Engenharia, dados e inovação tecnológica',
        badge: 'Tecnologia',
        category: 'technology',
        icon: <Cpu size={16} />,
        action: () => executeSearch('', 'technology'),
        section: 'CATEGORIAS DO ACERVO',
      },
      {
        id: 'cat-history',
        title: 'História & Humanidades',
        subtitle: 'Sociedade, memória e filosofia',
        badge: 'História',
        category: 'history',
        icon: <History size={16} />,
        action: () => executeSearch('', 'history'),
        section: 'CATEGORIAS DO ACERVO',
      },
      {
        id: 'cat-classic',
        title: 'Clássicos Universais',
        subtitle: 'Grandes referências da literatura mundial',
        badge: 'Clássicos',
        category: 'classic',
        icon: <BookOpen size={16} />,
        action: () => executeSearch('', 'classic'),
        section: 'CATEGORIAS DO ACERVO',
      },
      {
        id: 'cat-personal',
        title: 'Desenvolvimento & Carreira',
        subtitle: 'Habilidades, estudos e liderança',
        badge: 'Desenvolvimento',
        category: 'personal',
        icon: <GraduationCap size={16} />,
        action: () => executeSearch('', 'personal'),
        section: 'CATEGORIAS DO ACERVO',
      },
    ];
  }, [query, selectedCategory, navigate, closeSearchModal]);

  // Adjust selected index when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Keyboard navigation inside Command Palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSearchModal();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < items.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].action();
        } else if (query.trim()) {
          executeSearch(query.trim(), selectedCategory);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, items, query, selectedCategory, closeSearchModal]);

  if (!isOpen) return null;

  const currentSelectedItem = items[selectedIndex] || items[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="raycast-search-label"
      className="raycast-overlay"
      onClick={closeSearchModal}
    >
      <div
        className="raycast-palette animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Raycast Search Input Header */}
        <div className="raycast-input-bar">
          <Search size={20} className="raycast-search-icon" aria-hidden="true" />

          {selectedCategory !== 'all' && (
            <div className="raycast-active-filter-tag" title="Filtro ativo">
              <span>{selectedCategory}</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                aria-label="Remover filtro"
                className="raycast-filter-remove-btn"
              >
                <X size={11} />
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            id="book-raycast-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(sanitizeInput(e.target.value))}
            placeholder="Buscar por título, autor, assunto ou ISBN..."
            autoComplete="off"
            spellCheck={false}
            aria-label="Buscar livros no acervo universitário"
            className="raycast-input"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="raycast-clear-btn"
              aria-label="Limpar texto"
            >
              <X size={15} />
            </button>
          )}

          <div className="raycast-esc-pill" title="Pressione Esc para fechar">
            <kbd>ESC</kbd>
          </div>
        </div>

        {/* Raycast Items List */}
        <div ref={listRef} className="raycast-list" role="listbox">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const prevItem = items[index - 1];
            const isNewSection = !prevItem || prevItem.section !== item.section;

            return (
              <React.Fragment key={item.id}>
                {isNewSection && (
                  <div className="raycast-section-header" role="presentation">
                    {item.section}
                  </div>
                )}
                <div
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  className={`raycast-row ${isSelected ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => item.action()}
                >
                  <div className="raycast-row-icon" aria-hidden="true">
                    {item.icon}
                  </div>

                  <div className="raycast-row-content">
                    <span className="raycast-row-title">{item.title}</span>
                    {item.subtitle && (
                      <span className="raycast-row-subtitle">{item.subtitle}</span>
                    )}
                  </div>

                  <div className="raycast-row-meta">
                    {item.badge && (
                      <span className="raycast-row-badge">{item.badge}</span>
                    )}
                    {isSelected && (
                      <span className="raycast-row-action-pill">
                        <span>Avançar</span>
                        <CornerDownLeft size={11} />
                      </span>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Raycast Bottom Action Toolbar */}
        <div className="raycast-footer">
          <div className="raycast-footer-left">
            <div className="raycast-brand-mark" aria-hidden="true">
              <BookOpen size={13} />
            </div>
            <span className="raycast-brand-text">Nosso Livro</span>
            <span className="raycast-footer-dot">&bull;</span>
            <span className="raycast-footer-status">
              {query.trim() ? `Filtrando "${query.trim()}"` : 'Pronto para busca'}
            </span>
          </div>

          <div className="raycast-footer-right">
            <button
              type="button"
              className="raycast-primary-action-btn"
              onClick={() => {
                if (currentSelectedItem) {
                  currentSelectedItem.action();
                } else if (query.trim()) {
                  executeSearch(query.trim(), selectedCategory);
                }
              }}
            >
              <span>Avançar</span>
              <kbd className="raycast-kbd">
                <CornerDownLeft size={10} /> ↵
              </kbd>
            </button>

            <div className="raycast-shortcut-hint">
              <kbd className="raycast-kbd">↑</kbd>
              <kbd className="raycast-kbd">↓</kbd>
              <span>Navegar</span>
            </div>

            <div className="raycast-shortcut-hint">
              <kbd className="raycast-kbd">esc</kbd>
              <span>Fechar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
