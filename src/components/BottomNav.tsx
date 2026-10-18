import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { useBookStore } from '../store/bookStore';
import { useAuthStore } from '../store/authStore';
import { useSearchModalStore } from '../store/searchModalStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { getUserLoans } = useLoanStore();
  const { savedBooks } = useBookStore();
  const { isOpen: isSearchModalOpen, openSearchModal, closeSearchModal } = useSearchModalStore();

  const activeLoans = user ? getUserLoans(user.id).filter((l) => l.status === 'active') : [];

  const isSearchActive = location.pathname === '/search' || isSearchModalOpen;

  // Determine active index for sliding indicator
  let activeIndex = -1;
  if (isSearchActive) {
    activeIndex = 1;
  } else if (location.pathname === '/') {
    activeIndex = 0;
  } else if (location.pathname === '/saved') {
    activeIndex = 2;
  } else if (location.pathname === '/loans') {
    activeIndex = 3;
  }

  const handleNavClick = () => {
    if (isSearchModalOpen) {
      closeSearchModal();
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSearchModalOpen) {
      const inputEl = document.getElementById('book-raycast-search-input') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
      return;
    }
    const currentQ = location.pathname === '/search' ? new URLSearchParams(location.search).get('q') || '' : '';
    openSearchModal({ query: currentQ });
  };

  return (
    <nav
      className={`bottom-nav ${isSearchModalOpen ? 'on-search-modal' : ''}`}
      aria-label="Navegação principal"
      style={{ '--active-index': activeIndex } as React.CSSProperties}
    >
      {/* Sliding Red Active Background Indicator */}
      <div
        className={`bottom-nav-indicator ${activeIndex >= 0 ? 'visible' : ''}`}
        aria-hidden="true"
      />

      <NavLink
        to="/"
        end
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive && !isSearchActive ? 'active' : ''}`}
        aria-current={location.pathname === '/' && !isSearchActive ? 'page' : undefined}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m3.5 10.5 8.5-7 8.5 7v9a1 1 0 0 1-1 1h-5.2v-6.2h-4.6v6.2H4.5a1 1 0 0 1-1-1v-9Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <span>Início</span>
      </NavLink>

      <button
        type="button"
        onClick={handleSearchClick}
        className={`nav-item ${isSearchActive ? 'active' : ''}`}
        aria-current={isSearchActive ? 'page' : undefined}
        aria-label="Buscar livros no acervo"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span>Buscar</span>
      </button>

      <NavLink
        to="/saved"
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive && !isSearchActive ? 'active' : ''}`}
        aria-current={location.pathname === '/saved' && !isSearchActive ? 'page' : undefined}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.8L6 21V4.8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <span>Salvos</span>
        {savedBooks.length > 0 && <span className="nav-badge">{savedBooks.length}</span>}
      </NavLink>

      <NavLink
        to="/loans"
        onClick={handleNavClick}
        className={({ isActive }) => `nav-item ${isActive && !isSearchActive ? 'active' : ''}`}
        aria-current={location.pathname === '/loans' && !isSearchActive ? 'page' : undefined}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <span>Empréstimos</span>
        {activeLoans.length > 0 && <span className="nav-badge">{activeLoans.length}</span>}
      </NavLink>
    </nav>
  );
};
