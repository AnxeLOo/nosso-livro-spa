import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { formatDate, getDaysRemaining } from '../utils/formatters';
import { Clock, CheckCircle2, RotateCcw, AlertTriangle, BookOpen, Layers, XCircle } from 'lucide-react';

export const Loans: React.FC = () => {
  const { user } = useAuthStore();
  const { getUserLoans, getUserReservations, returnBook, renewLoan, cancelReservation } = useLoanStore();
  const { showToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'loans' | 'reservations' | 'history'>('loans');

  const userId = user?.id || '';
  const allLoans = getUserLoans(userId);
  const activeLoans = allLoans.filter((l) => l.status === 'active');
  const returnedLoans = allLoans.filter((l) => l.status === 'returned');
  const reservations = getUserReservations(userId);

  const handleReturn = (loanId: string, bookTitle: string) => {
    const res = returnBook(loanId);
    if (res.success) {
      showToast(`"${bookTitle}" devolvido com sucesso!`);
    } else {
      showToast(res.message || 'Erro ao devolver livro.');
    }
  };

  const handleRenew = (loanId: string) => {
    const res = renewLoan(loanId);
    showToast(res.message || 'Renovação processada.');
  };

  const handleCancelReservation = (reservationId: string) => {
    cancelReservation(reservationId);
    showToast('Reserva cancelada.');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <section style={{ marginBottom: '24px' }}>
        <span className="eyebrow">CONTROLE ACADÊMICO</span>
        <h1 style={{ margin: '8px 0 6px', fontSize: '28px', fontWeight: 750, letterSpacing: '-0.7px' }}>
          Meus Empréstimos & Reservas
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '13px' }}>
          Gerencie prazos de devolução, renove empréstimos ativos e acompanhe sua posição na fila de espera.
        </p>
      </section>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--stroke)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('loans')}
          className={`filter-pill ${activeTab === 'loans' ? 'active' : ''}`}
        >
          Empréstimos Ativos ({activeLoans.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reservations')}
          className={`filter-pill ${activeTab === 'reservations' ? 'active' : ''}`}
        >
          Fila de Reservas ({reservations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`filter-pill ${activeTab === 'history' ? 'active' : ''}`}
        >
          Histórico Devolvidos ({returnedLoans.length})
        </button>
      </div>

      {/* Tab Content: Active Loans */}
      {activeTab === 'loans' && (
        <div>
          {activeLoans.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} />
              <p style={{ margin: 0, fontWeight: 600 }}>Você não possui nenhum empréstimo ativo no momento.</p>
              <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
                Navegue pelo catálogo da biblioteca e retire sua próxima leitura acadêmica.
              </p>
              <Link to="/" className="primary-button" style={{ width: 'auto', padding: '0 20px', display: 'inline-flex' }}>
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeLoans.map((loan) => {
                const remaining = getDaysRemaining(loan.dueAt);
                return (
                  <div
                    key={loan.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      padding: '18px 20px',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div style={{ flex: '1 1 260px' }}>
                      <Link
                        to={`/book/${loan.bookId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, letterSpacing: '-0.3px' }}>
                          {loan.bookTitle}
                        </h3>
                      </Link>
                      <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--muted)' }}>
                        {loan.bookAuthor}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                        <span>Retirado em: <strong>{formatDate(loan.borrowedAt)}</strong></span>
                        <span>Prazo: <strong>{formatDate(loan.dueAt)}</strong></span>
                        {loan.renewCount > 0 && <span>(Renovado {loan.renewCount}x)</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span
                        className="pill"
                        style={{
                          background: remaining.isOverdue
                            ? 'rgba(255, 69, 58, 0.2)'
                            : remaining.days <= 2
                            ? 'rgba(255, 214, 10, 0.2)'
                            : 'rgba(48, 209, 88, 0.15)',
                          color: remaining.isOverdue
                            ? 'var(--red-light)'
                            : remaining.days <= 2
                            ? 'var(--yellow)'
                            : 'var(--green)',
                        }}
                      >
                        {remaining.isOverdue ? <AlertTriangle size={12} /> : <Clock size={12} />}
                        {remaining.label}
                      </span>

                      <button
                        type="button"
                        className="secondary-button"
                        style={{ minHeight: '38px', padding: '0 12px', fontSize: '12px' }}
                        onClick={() => handleRenew(loan.id)}
                        disabled={loan.renewCount >= 2}
                        title={loan.renewCount >= 2 ? 'Limite de renovações atingido' : 'Adicionar 7 dias ao prazo'}
                      >
                        <RotateCcw size={13} />
                        Renovar
                      </button>

                      <button
                        type="button"
                        className="primary-button"
                        style={{ width: 'auto', minHeight: '38px', padding: '0 16px', fontSize: '12px' }}
                        onClick={() => handleReturn(loan.id, loan.bookTitle)}
                      >
                        <CheckCircle2 size={14} />
                        Devolver Livro
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Reservations */}
      {activeTab === 'reservations' && (
        <div>
          {reservations.length === 0 ? (
            <div className="empty-state">
              <Layers size={36} />
              <p style={{ margin: 0, fontWeight: 600 }}>Nenhuma reserva em andamento.</p>
              <p style={{ margin: '6px 0 16px', fontSize: '13px' }}>
                Quando um livro estiver esgotado no acervo, você pode entrar na fila de espera para retirá-lo.
              </p>
              <Link to="/" className="secondary-button">
                Ver Livros Disponíveis
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reservations.map((res) => (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ flex: '1 1 260px' }}>
                    <Link to={`/book/${res.bookId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700 }}>
                        {res.bookTitle}
                      </h3>
                    </Link>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--muted)' }}>
                      {res.bookAuthor}
                    </p>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Solicitado em: {formatDate(res.reservedAt)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      className="pill"
                      style={{
                        background: res.status === 'ready' ? 'rgba(48, 209, 88, 0.2)' : 'rgba(255, 159, 10, 0.2)',
                        color: res.status === 'ready' ? 'var(--green)' : 'var(--orange)',
                      }}
                    >
                      {res.status === 'ready' ? 'Pronto para Retirada no Balcão!' : `Fila: Posição #${res.queuePosition}`}
                    </span>

                    <button
                      type="button"
                      className="secondary-button"
                      style={{ minHeight: '38px', padding: '0 12px', fontSize: '12px' }}
                      onClick={() => handleCancelReservation(res.id)}
                    >
                      <XCircle size={14} />
                      Cancelar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Return History */}
      {activeTab === 'history' && (
        <div>
          {returnedLoans.length === 0 ? (
            <div className="empty-state">
              <Clock size={36} />
              <p style={{ margin: 0, fontWeight: 600 }}>Nenhum histórico de devolução registrado ainda.</p>
              <p style={{ margin: '6px 0 0', fontSize: '13px' }}>
                Os livros devolvidos à biblioteca permanecerão registrados aqui para seu controle acadêmico.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {returnedLoans.map((loan) => (
                <div
                  key={loan.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block' }}>{loan.bookTitle}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{loan.bookAuthor}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: 'var(--green)', display: 'block', fontWeight: 600 }}>
                      Devolvido
                    </span>
                    <small style={{ fontSize: '11px', color: 'var(--muted)' }}>
                      em {loan.returnedAt ? formatDate(loan.returnedAt) : '-'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
