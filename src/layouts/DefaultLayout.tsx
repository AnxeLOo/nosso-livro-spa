import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Toast } from '../components/Toast';
import { SearchModal } from '../components/SearchModal';

export const DefaultLayout: React.FC = () => {
  return (
    <div className="app-shell">
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />
      <SearchModal />
      <Toast />
    </div>
  );
};
