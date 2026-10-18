import React from 'react';
import { useToastStore } from '../store/toastStore';

export const Toast: React.FC = () => {
  const { message, isVisible } = useToastStore();

  return (
    <div
      className={`toast ${isVisible ? 'visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};
