import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { User, Mail, ShieldCheck, Building2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [perfil, setPerfil] = useState('operador');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      await api.post('/auth/cadastro', {
        nome,
        email,
        senha,
        perfil
      });

      setSucesso(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErro(err.response?.data?.detail || 'Erro ao realizar cadastro.');
      setCarregando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main, #0f172a)', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 1.75rem', background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', background: '#0284c7', padding: '10px', borderRadius: '12px', color: '#fff', marginBottom: '0.5rem' }}>
            <Building2 size={28} />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary, #fff)' }}>Novo Cadastro de Usuário</h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.82rem' }}>Almoxarifado &bull; Lagoa do Piauí</p>
        </div>

        {erro && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{erro}</span>
          </div>
        )}

        {sucesso && (
          <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} />
            <span>Usuário registrado com sucesso! Redirecionando...</span>
          </div>
        )}

        <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.3rem' }}>
              Nome Completo
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} color="#64748b" style={{ position: 'absolute', left: 10 }} />
              <input
                type="text"
                required
                placeholder="Ex: Maria da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.3rem' }}>
              E-mail Institucional
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} color="#64748b" style={{ position: 'absolute', left: 10 }} />
              <input
                type="email"
                required
                placeholder="exemplo@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.2rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.3rem' }}>
              Perfil de Acesso
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShieldCheck size={16} color="#64748b" style={{ position: 'absolute', left: 10 }} />
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.2rem' }}
              >
                <option value="operador">Operador (Entradas, Saídas e Estoque)</option>
                <option value="auditor">Auditor (Apenas Consulta e Relatórios)</option>
                <option value="admin">Administrador Geral</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.3rem' }}>
                Senha
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 dígitos"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="form-control"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.3rem' }}>
                Confirmar
              </label>
              <input
                type="password"
                required
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 700, marginTop: '0.5rem' }}
          >
            {carregando ? 'Registrando...' : 'Concluir Cadastro'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary, #94a3b8)' }}>
          Já possui conta?{' '}
          <Link to="/login" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}