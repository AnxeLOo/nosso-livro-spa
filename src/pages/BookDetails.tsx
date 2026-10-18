import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../types/book';
import { getBookDetails } from '../services/openLibrary';
import { useBookStore } from '../store/bookStore';
import { useLoanStore } from '../store/loanStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { ReadingStatusTracker } from '../components/ReadingStatusBadge';
import { Modal } from '../components/Modal';
import { ArrowLeft, Bookmark, Calendar, CheckCircle2, Clock, Layers, Loader2, Users } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { books, isBookSaved, toggleSaveBook } = useBookStore();
  const { user } = useAuthStore();
  const { borrowBook, reserveBook, getAvailableCopies, isBookBorrowedByUser, isBookReservedByUser } = useLoanStore();
  const { showToast } = useToastStore();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Check if book is already in store cache
    const cached = books.find((b) => b.id === id);
    if (cached) {
      setBook(cached);
      setLoading(false);
    } else {
      setLoading(true);
      getBookDetails(id)
        .then((data) => {
          setBook(data);
          setLoading(false);
        })
        .catch(() => {
          setError('Não foi possível carregar as informações deste livro na Open Library.');
          setLoading(false);
        });
    }
  }, [id, books]);

  if (loading) {
    return (
      <div className="empty-state animate-fade-in" style={{ marginTop: '40px' }}>
        <Loader2 size={36} style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
        <p>Carregando detalhes do exemplar na Open Library...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="empty-state animate-fade-in" style={{ marginTop: '40px' }}>
        <p style={{ color: '#ff9d97', marginBottom: '16px' }}>{error || 'Livro não encontrado.'}</p>
        <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Voltar ao catálogo
        </button>
      </div>
    );
  }

  const userId = user?.id || 'usr_guest';
  const userName = user?.name || 'Visitante';
  const saved = isBookSaved(book.id);
  const availableCopies = getAvailableCopies(book.id, book.totalCopies);
  const isAvailable = availableCopies > 0;
  const isBorrowedByMe = isBookBorrowedByUser(book.id, userId);
  const isReservedByMe = isBookReservedByUser(book.id, userId);

  // Calculate return date (+14 days)
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 14);

  const handleConfirmLoan = () => {
    const res = borrowBook(book, userId, userName);
    setIsLoanModalOpen(false);
    if (res.success) {
      showToast(`Empréstimo confirmado! Devolução prevista para ${formatDate(returnDate.toISOString())}.`);
    } else {
      showToast(res.error || 'Não foi possível realizar o empréstimo.');
    }
  };

  const handleConfirmReserve = () => {
    const res = reserveBook(book, userId, userName);
    setIsReserveModalOpen(false);
    if (res.success) {
      showToast(`Reserva confirmada! Posição na fila: #${res.reservation?.queuePosition}.`);
    } else {
      showToast(res.error || 'Não foi possível realizar a reserva.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '30px' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="secondary-button"
        style={{ marginBottom: '20px', minHeight: '38px', padding: '0 14px' }}
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {/* Left Column: Book Art Cover */}
        <div>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              background: 'linear-gradient(145deg, #2b1d24, #141217)',
              aspectRatio: '3 / 4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: '440px',
            }}
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <span className="eyebrow" style={{ display: 'block', marginBottom: '8px' }}>
                  {book.firstPublishYear ? `Edição de ${book.firstPublishYear}` : 'LIVRO UNIVERSITÁRIO'}
                </span>
                <h2 style={{ fontSize: '24px', margin: '0 0 10px', color: '#fff' }}>{book.title}</h2>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{book.author}</p>
              </div>
            )}

            <button
              className="save-button"
              type="button"
              onClick={() => {
                const isNowSaved = toggleSaveBook(book);
                showToast(isNowSaved ? 'Livro adicionado aos salvos.' : 'Livro removido dos salvos.');
              }}
              aria-pressed={saved}
              aria-label={saved ? 'Remover dos salvos' : 'Salvar na lista'}
              style={{ top: '16px', right: '16px', width: '40px', height: '40px' }}
            >
              <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.8} />
            </button>
          </div>

          <ReadingStatusTracker bookId={book.id} />
        </div>

        {/* Right Column: Book Details and Loan Actions */}
        <div>
          <span className="eyebrow">{book.category || 'ACERVO GERAL'}</span>
          <h1 style={{ margin: '8px 0 6px', fontSize: '30px', fontWeight: 750, letterSpacing: '-0.8px' }}>
            {book.title}
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: '15px', color: 'var(--muted)' }}>
            Por <strong style={{ color: 'var(--text)' }}>{book.author}</strong>
          </p>

          {/* Quick specs pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {book.firstPublishYear && (
              <span className="pill">
                <Calendar size={13} />
                Publicado em {book.firstPublishYear}
              </span>
            )}
            <span className="pill">
              <Layers size={13} />
              Total: {book.totalCopies} cópias
            </span>
            <span className="pill" style={{ color: isAvailable ? 'var(--green)' : 'var(--red-light)' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isAvailable ? 'var(--green)' : 'var(--red)',
                }}
              />
              {isAvailable ? `${availableCopies} disponíveis no campus` : '0 disponíveis (fila de reserva)'}
            </span>
          </div>

          {/* Synopsis */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px' }}>Sinopse e Informações</h3>
            <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#d0cdd2' }}>
              {book.description ||
                'Obra acadêmica integrante do acervo institucional da biblioteca universitária. Indicada para disciplinas afins e estudos aprofundados.'}
            </p>
          </div>

          {/* Tags */}
          {book.subjects && book.subjects.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--muted)', marginBottom: '8px' }}>
                Tópicos Relacionados
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {book.subjects.slice(0, 6).map((sub, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--stroke)',
                      color: 'var(--muted)',
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loan / Reservation Action Section */}
          <div
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {isBorrowedByMe ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--green)', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={18} />
                  Você possui um empréstimo ativo deste livro
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--muted)' }}>
                  Acompanhe os prazos de devolução ou solicite renovação na tela de Empréstimos.
                </p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate('/loans')}
                  style={{ width: '100%' }}
                >
                  Ver Meus Empréstimos
                </button>
              </div>
            ) : isReservedByMe ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--orange)', fontWeight: 700, marginBottom: '8px' }}>
                  <Clock size={18} />
                  Você está na fila de espera deste livro
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--muted)' }}>
                  Você será notificado assim que um exemplar for devolvido na biblioteca.
                </p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate('/loans')}
                  style={{ width: '100%' }}
                >
                  Ver Minhas Reservas
                </button>
              </div>
            ) : isAvailable ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ fontSize: '15px', display: 'block' }}>Exemplar Disponível</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Prazo padrão: 14 dias corridos</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
                    {availableCopies} cópias
                  </span>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setIsLoanModalOpen(true)}
                >
                  Solicitar Empréstimo Universitário
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <strong style={{ fontSize: '15px', display: 'block', color: 'var(--red-light)' }}>
                      Exemplares Esgotados
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Todos os exemplares estão emprestados no momento.
                    </span>
                  </div>
                  <Users size={20} color="var(--muted)" />
                </div>
                <button
                  type="button"
                  className="primary-button"
                  style={{ background: 'linear-gradient(145deg, #e67e22, #d35400)' }}
                  onClick={() => setIsReserveModalOpen(true)}
                >
                  Entrar na Fila de Reserva
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Confirm Loan */}
      <Modal
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
        title="Confirmar Empréstimo"
      >
        <div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
            Você está solicitando o empréstimo da obra <strong>{book.title}</strong> para sua conta acadêmica.
          </p>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              marginBottom: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Aluno:</span>
              <strong>{userName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Data de Retirada:</span>
              <strong>{formatDate(new Date().toISOString())}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Data Limite de Devolução:</span>
              <strong style={{ color: 'var(--red-light)' }}>{formatDate(returnDate.toISOString())} (14 dias)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsLoanModalOpen(false)}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleConfirmLoan}
              style={{ flex: 1 }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirm Reserve */}
      <Modal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        title="Confirmar Reserva"
      >
        <div>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
            Deseja entrar na fila de espera para <strong>{book.title}</strong>? Quando um exemplar for devolvido por outro estudante, você terá prioridade para retirada.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIsReserveModalOpen(false)}
              style={{ flex: 1 }}
            >
              Voltar
            </button>
            <button
              type="button"
              className="primary-button"
              style={{ flex: 1, background: 'linear-gradient(145deg, #e67e22, #d35400)' }}
              onClick={handleConfirmReserve}
            >
              Entrar na Fila
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
