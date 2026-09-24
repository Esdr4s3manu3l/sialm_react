import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { User, Mail, Shield, KeyRound, CheckCircle2, AlertCircle, Calendar, Building2 } from 'lucide-react';

export default function Perfil() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('sialm_user') || '{}'));
  const [detalhes, setDetalhes] = useState(null);

  // Estados dos formulários
  const [nome, setNome] = useState(usuario.nome || '');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const [msgDados, setMsgDados] = useState({ tipo: '', texto: '' });
  const [msgSenha, setMsgSenha] = useState({ tipo: '', texto: '' });
  const [salvandoDados, setSalvandoDados] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    if (usuario.id) {
      api.get(`/perfil/${usuario.id}`).then((res) => {
        setDetalhes(res.data);
        setNome(res.data.nome);
      });
    }
  }, [usuario.id]);

  async function atualizarNome(e) {
    e.preventDefault();
    setMsgDados({ tipo: '', texto: '' });
    setSalvandoDados(true);

    try {
      const res = await api.put('/perfil/atualizar-dados', {
        usuario_id: usuario.id,
        nome: nome
      });
      localStorage.setItem('sialm_user', JSON.stringify(res.data.user));
      setUsuario(res.data.user);
      setMsgDados({ tipo: 'sucesso', texto: 'Nome atualizado com sucesso!' });
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setMsgDados({ tipo: 'erro', texto: err.response?.data?.detail || 'Erro ao atualizar dados.' });
    } finally {
      setSalvandoDados(false);
    }
  }

  async function alterarSenha(e) {
    e.preventDefault();
    setMsgSenha({ tipo: '', texto: '' });

    if (novaSenha !== confirmaSenha) {
      setMsgSenha({ tipo: 'erro', texto: 'A confirmação não coincide com a nova palavra-passe.' });
      return;
    }

    if (novaSenha.length < 6) {
      setMsgSenha({ tipo: 'erro', texto: 'A nova palavra-passe deve conter pelo menos 6 dígitos.' });
      return;
    }

    setSalvandoSenha(true);
    try {
      await api.post('/perfil/alterar-senha', {
        usuario_id: usuario.id,
        senha_atual: senhaAtual,
        nova_senha: novaSenha
      });
      setMsgSenha({ tipo: 'sucesso', texto: 'Palavra-passe alterada com sucesso!' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmaSenha('');
    } catch (err) {
      setMsgSenha({ tipo: 'erro', texto: err.response?.data?.detail || 'Falha ao redefinir a palavra-passe.' });
    } finally {
      setSalvandoSenha(false);
    }
  }

  function formatarPerfil(p) {
    switch ((p || '').toLowerCase()) {
      case 'admin': return 'Administrador Geral';
      case 'auditor': return 'Auditor Municipal';
      default: return 'Operador do Almoxarifado';
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Meu Perfil</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Gerencie as suas informações de identificação e credenciais de acesso.</p>
      </div>

      {/* CARTÃO DE RESUMO INSTITUCIONAL */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--brand-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 800
        }}>
          {nome ? nome.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{nome}</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={14} /> {usuario.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} color="#0284c7" /> {formatarPerfil(usuario.perfil)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Building2 size={14} /> Município de Lagoa do Piauí
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* FORMULÁRIO DE DADOS PESSOAIS */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--brand-primary)" /> Dados Pessoais
          </h3>

          {msgDados.texto && (
            <div style={{
              background: msgDados.tipo === 'sucesso' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${msgDados.tipo === 'sucesso' ? '#22c55e' : '#ef4444'}`,
              color: msgDados.tipo === 'sucesso' ? '#22c55e' : '#ef4444',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {msgDados.tipo === 'sucesso' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{msgDados.texto}</span>
            </div>
          )}

          <form onSubmit={atualizarNome} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                E-mail Institucional (Bloqueado)
              </label>
              <input
                type="text"
                disabled
                value={usuario.email || ''}
                className="form-control"
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Data de Criação da Conta
              </label>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {detalhes?.criado_em || 'Registo inicial do sistema'}
              </div>
            </div>

            <button type="submit" disabled={salvandoDados} className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {salvandoDados ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </form>
        </div>

        {/* FORMULÁRIO DE ALTERAÇÃO AUTÓNOMA DA PALAVRA-PASSE */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={18} color="#f59e0b" /> Segurança e Palavra-passe
          </h3>

          {msgSenha.texto && (
            <div style={{
              background: msgSenha.tipo === 'sucesso' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${msgSenha.tipo === 'sucesso' ? '#22c55e' : '#ef4444'}`,
              color: msgSenha.tipo === 'sucesso' ? '#22c55e' : '#ef4444',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {msgSenha.tipo === 'sucesso' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{msgSenha.texto}</span>
            </div>
          )}

          <form onSubmit={alterarSenha} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Palavra-passe Atual
              </label>
              <input
                type="password"
                required
                placeholder="Introduza a palavra-passe atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Nova Palavra-passe
              </label>
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                Confirmar Nova Palavra-passe
              </label>
              <input
                type="password"
                required
                placeholder="Repita a nova palavra-passe"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                className="form-control"
              />
            </div>

            <button type="submit" disabled={salvandoSenha} className="btn btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {salvandoSenha ? 'A atualizar...' : 'Atualizar Palavra-passe'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}