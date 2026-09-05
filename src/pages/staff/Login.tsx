import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, supabaseConfigured } from '../../auth/AuthContext';
import './Login.css';

export function Login() {
  const { session, signIn } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    const from = (location.state as { from?: string })?.from ?? '/area-colaboradora/agendamento';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const err = await signIn(username, password);
    setSubmitting(false);
    if (err) setError(err);
  }

  return (
    <section className="staff-login">
      <form className="staff-login-card" onSubmit={handleSubmit}>
        <div className="sec-label">Área da Colaboradora</div>
        <h1 className="staff-login-title">Entrar</h1>
        <p className="staff-login-sub">Acesso restrito à equipe do Afrodite Studio.</p>

        {!supabaseConfigured && (
          <p className="staff-login-warning">
            O acesso ainda não foi configurado neste ambiente. Fale com quem administra o site.
          </p>
        )}

        <label className="staff-field">
          <span>Usuário</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="flavia, jheny ou vitoria"
            required
          />
        </label>

        <label className="staff-field">
          <span>Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="staff-login-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting || !supabaseConfigured}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
}
