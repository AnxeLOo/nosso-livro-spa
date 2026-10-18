import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { LogOut, BookOpen, Search } from 'lucide-react';
import { useSearchModalStore } from '../store/searchModalStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const { openSearchModal } = useSearchModalStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Sessão encerrada com sucesso.');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label="Ir para a página inicial">
        <div className="brand-mark" aria-hidden="true">
          <BookOpen size={26} strokeWidth={2.2} />
        </div>
        <div>
          <div className="brand-name">Nosso Livro</div>
          <div className="brand-tagline">Biblioteca Universitária</div>
        </div>
      </Link>

      <div className="topbar-right">
        <button
          className="header-search-btn"
          type="button"
          onClick={() => openSearchModal()}
          title="Buscar livros (⌘K)"
          aria-label="Abrir pesquisa de livros"
        >
          <Search size={16} />
          <span className="header-search-label">Buscar livros...</span>
          <span className="header-search-kbd">⌘K</span>
        </button>

        {user && (
          <>
            <div className="user-badge" title={`${user.name} (${user.course})`}>
            <span
              className="avatar"
              style={{ background: user.avatarGradient || 'linear-gradient(145deg,#ff5b50,#b81628)' }}
            >
              {user.avatarInitials}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <strong style={{ fontSize: '12px' }}>{user.name.split(' ')[0]}</strong>
              <small style={{ fontSize: '10px', color: 'var(--muted)' }}>
                {user.role === 'librarian' ? 'Bibliotecário' : user.role === 'professor' ? 'Docente' : 'Aluno'}
              </small>
            </div>
          </div>

          <button
            className="avatar-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Menu do usuário"
            aria-expanded={menuOpen}
            aria-label="Abrir menu do usuário"
          >
            <LogOut size={16} onClick={handleLogout} />
          </button>
        </>
      )}
    </div>
  </header>
);
};
