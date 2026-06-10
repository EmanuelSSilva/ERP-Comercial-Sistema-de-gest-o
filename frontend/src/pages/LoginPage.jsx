import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit } = useForm({ defaultValues: { email: 'admin@erp.com', senha: 'admin123' } });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function submit(values) {
    setError('');
    setLoading(true);
    try {
      await login(values);
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">EC</div>
        <div className="login-title">ERP Comercial</div>
        <div className="login-sub">Faça login para continuar</div>

        <form onSubmit={handleSubmit(submit)} style={{ display: 'grid', gap: 16 }}>
          <label>
            <span className="login-field-label" style={{ display: 'block', marginBottom: 6 }}>E-mail</span>
            <input className="login-input" type="email" autoComplete="email" {...register('email')} />
          </label>
          <label>
            <span className="login-field-label" style={{ display: 'block', marginBottom: 6 }}>Senha</span>
            <input className="login-input" type="password" autoComplete="current-password" {...register('senha')} />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="login-btn" disabled={loading}>
            <LockKeyhole size={16} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
