import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Mail, Lock, Eye, EyeOff, Building2, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const res = await api.post('/auth/login', { email, senha });
      localStorage.setItem('sialm_user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao autenticar com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main, #0f172a)', padding: '1rem' }}>
      <div 
        className="card" 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          padding: '2.5rem 1.75rem', 
          background: 'var(--bg-card, #1e293b)', 
          border: '1px solid var(--border-color, #334155)', 
          borderRadius: '12px' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: '#0284c7', padding: '10px', borderRadius: '12px', color: '#fff', marginBottom: '0.75rem' }}>
            <Building2 size={30} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary, #fff)' }}>SIALM</h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.82rem', marginTop: '4px' }}>
            Prefeitura Municipal de Lagoa do Piauí
          </p>
        </div>

        {erro && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>
              E-mail
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 12 }} />
              <input
                type="email"
                required
                placeholder="seu.email@sialm.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>
              Senha
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color="#64748b" style={{ position: 'absolute', left: 12 }} />
              <input
                type={mostrarSenha ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}
          >
            {carregando ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary, #94a3b8)' }}>
          Não tem usuário?{' '}
          <Link to="/cadastro" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}