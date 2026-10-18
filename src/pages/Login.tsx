import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, DEMO_USERS } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { Eye, EyeOff, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';
import '../assets/styles/login.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const { showToast } = useToastStore();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanCred = sanitizeInput(credential);
    if (!cleanCred) {
      setErrorMessage('Por favor, informe seu e-mail institucional ou matrícula.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);
    const result = await login(cleanCred, password);
    setIsLoading(false);

    if (result.success) {
      showToast('Bem-vindo ao Nosso Livro!');
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.error || 'Credenciais inválidas. Tente novamente.');
    }
  };

  const handleFillDemo = (email: string, pass: string) => {
    setCredential(email);
    setPassword(pass);
    setErrorMessage('');
  };

  return (
    <div className="login-page-wrap">
      <div className="login-card animate-fade-in">
        <div className="login-header">
          <span className="eyebrow">PORTAL ACADÊMICO</span>
          <h1>Entrar na sua conta</h1>
          <p>Acesse o acervo universitário, gerencie seus empréstimos e reserve exemplares.</p>
        </div>

        {errorMessage && (
          <div className="error-banner" role="alert" style={{ marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="credential">
              <span>E-mail institucional ou Matrícula</span>
            </label>
            <div className="input-container">
              <input
                id="credential"
                type="text"
                className="input-field"
                placeholder="ex: aluno@universidade.edu.br ou 20241001"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                autoComplete="username"
                required
              />
              <span className="input-icon-btn">
                <UserIcon size={18} />
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <span>Senha</span>
              <button
                type="button"
                className="text-action"
                style={{ fontSize: '11px', padding: 0 }}
                onClick={() => showToast('Entre em contato com a biblioteca para redefinir sua senha.')}
              >
                Esqueceu a senha?
              </button>
            </label>
            <div className="input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? 'Autenticando...' : 'Acessar Biblioteca'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="demo-box">
          <div className="demo-box-title">
            <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Acesso Rápido com Contas Demo:
          </div>
          <div className="demo-pills">
            {Object.entries(DEMO_USERS).map(([email, { user, pass }]) => (
              <div
                key={email}
                className="demo-account-item"
                onClick={() => handleFillDemo(email, pass)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFillDemo(email, pass)}
                title="Clique para preencher as credenciais"
              >
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ color: 'var(--muted)', fontSize: '11px' }}>{email}</div>
                </div>
                <span className="demo-role-tag">
                  {user.role === 'librarian' ? 'Bibliotecário' : user.role === 'professor' ? 'Professor' : 'Estudante'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
