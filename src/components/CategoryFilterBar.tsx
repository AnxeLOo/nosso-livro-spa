import React from 'react';
import { CategoryFilter, SortOption } from '../types/book';
import { CATEGORY_LABELS } from '../services/openLibrary';

interface CategoryFilterBarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const CATEGORIES: CategoryFilter[] = ['all', 'fiction', 'science', 'history', 'classic', 'personal', 'technology'];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-pills" role="tablist" aria-label="Categorias de livros">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat}
            className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="sort-select-wrap">
        <label htmlFor="sort-select">Ordenar por:</label>
        <select
          id="sort-select"
          className="sort-select"
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value as SortOption)}
        >
          <option value="relevance">Relevância</option>
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="author">Autor</option>
        </select>
      </div>
    </div>
  );
};
