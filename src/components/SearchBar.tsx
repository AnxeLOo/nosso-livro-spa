import React, { useEffect, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-wrap" onSubmit={handleSubmit} role="search">
      <div className="search">
        <SearchIcon size={18} strokeWidth={2} style={{ color: '#c5c1c6', flexShrink: 0 }} />
        <input
          ref={inputRef}
          id="book-search"
          type="search"
          value={value}
          onChange={(e) => onChange(sanitizeInput(e.target.value))}
          placeholder="Buscar por título, autor, assunto ou ISBN..."
          autoComplete="off"
          aria-label="Buscar livros na biblioteca"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onSubmit();
            }}
            style={{ padding: '4px', color: 'var(--muted)', display: 'flex' }}
            aria-label="Limpar busca"
          >
            <X size={16} />
          </button>
        ) : (
          <span className="search-shortcut" title="Atalho de teclado">
            ⌘K
          </span>
        )}
      </div>
    </form>
  );
};
