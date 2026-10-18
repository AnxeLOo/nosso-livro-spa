import React from 'react';
import { ReadingStatus } from '../types/book';
import { useBookStore } from '../store/bookStore';
import { useToastStore } from '../store/toastStore';
import { BookOpen, CheckCircle2, Bookmark, CircleDashed } from 'lucide-react';

interface ReadingStatusTrackerProps {
  bookId: string;
}

export const ReadingStatusTracker: React.FC<ReadingStatusTrackerProps> = ({ bookId }) => {
  const { getReadingStatus, setReadingStatus } = useBookStore();
  const { showToast } = useToastStore();

  const currentStatus = getReadingStatus(bookId);

  const options: { value: ReadingStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'reading', label: 'Lendo', icon: <BookOpen size={14} /> },
    { value: 'completed', label: 'Concluído', icon: <CheckCircle2 size={14} /> },
    { value: 'wishlist', label: 'Lista de desejos', icon: <Bookmark size={14} /> },
    { value: 'none', label: 'Nenhum', icon: <CircleDashed size={14} /> },
  ];

  const handleStatusChange = (status: ReadingStatus) => {
    setReadingStatus(bookId, status);
    const label = options.find((o) => o.value === status)?.label;
    showToast(`Status de leitura atualizado para: ${label}`);
  };

  return (
    <div style={{ marginTop: '16px', background: 'var(--surface)', padding: '14px', borderRadius: '16px', border: '1px solid var(--stroke)' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', marginBottom: '10px' }}>
        Meu Status de Leitura
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleStatusChange(opt.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 10px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid',
              borderColor: currentStatus === opt.value ? 'var(--red)' : 'var(--stroke)',
              background: currentStatus === opt.value ? 'rgba(255, 69, 58, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: currentStatus === opt.value ? '#ff8982' : 'var(--text)',
              transition: 'all 0.15s ease',
            }}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
