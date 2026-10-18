import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Toast } from '../components/Toast';
import { BookOpen, ShieldCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Nosso Livro">
          <div className="brand-mark" aria-hidden="true">
            <BookOpen size={26} strokeWidth={2.2} />
          </div>
          <div>
            <div className="brand-name">Nosso Livro</div>
            <div className="brand-tagline">Biblioteca Universitária</div>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '12px' }}>
          <ShieldCheck size={16} color="var(--green)" />
          <span>Acesso Seguro</span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <footer style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '11px' }}>
        Plataforma Integrada de Biblioteca e Empréstimos — Universidade Federal
      </footer>

      <Toast />
    </div>
  );
};
