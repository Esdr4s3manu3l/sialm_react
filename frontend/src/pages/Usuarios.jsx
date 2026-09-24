import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { 
  Users, Shield, KeyRound, Trash2, CheckCircle2, 
  AlertCircle, Plus, Search, UserCheck, ShieldAlert 
} from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erro, setErro] = useState('');

  // Modais
  const [modalSenhaId, setModalSenhaId] = useState(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const usuarioLogado = JSON.parse(localStorage.getItem('sialm_user') || '{}');

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      setErro('Erro ao carregar a lista de usuários.');
    } finally {
      setCarregando(false);
    }
  }

  function mostrarAviso(msg) {
    setMensagemSucesso(msg);
    setTimeout(() => setMensagemSucesso(''), 3500);
  }

  async function alterarPerfil(id, novoPerfil, nome) {
    if (id === usuarioLogado.id && novoPerfil !== 'admin') {
      alert('Você não pode revogar seu próprio acesso de Administrador!');
      return;
    }

    try {
      await api.patch(`/usuarios/${id}/perfil`, { perfil: novoPerfil });
      mostrarAviso(`Perfil de ${nome} alterado para ${novoPerfil.toUpperCase()}!`);
      carregar();
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao alterar perfil.');
    }
  }

  async function salvarNovaSenha(e) {
    e.preventDefault();
    if (novaSenha.length < 6) {
      alert('A senha deve possuir pelo menos 6 dígitos.');
      return;
    }

    setSalvandoSenha(true);
    try {
      await api.patch(`/usuarios/${modalSenhaId}/senha`, { nova_senha: novaSenha });
      mostrarAviso('Senha redefinida com sucesso!');
      setModalSenhaId(null);
      setNovaSenha('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao redefinir senha.');
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function excluirUsuario(id, nome) {
    if (id === usuarioLogado.id) {
      alert('Você não pode excluir sua própria conta enquanto estiver logado.');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"? Esta ação revogará todo o acesso dele ao sistema.`)) {
      return;
    }

    try {
      await api.delete(`/usuarios/${id}`);
      mostrarAviso(`Usuário ${nome} excluído com sucesso.`);
      carregar();
    } catch (err) {
      alert(err.response?.data?.detail || 'Erro ao excluir usuário.');
    }
  }

  const filtrados = usuarios.filter(u => 
    u.nome.toLowerCase().includes(busca.toLowerCase()) || 
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      {/* CABEÇALHO DA PÁGINA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Controle de Usuários e Permissões
          </h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.85rem' }}>
            Painel exclusivo do Administrador Geral para gestão de contas e níveis de acesso.
          </p>
        </div>
      </div>

      {mensagemSucesso && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <CheckCircle2 size={16} />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <AlertCircle size={16} />
          <span>{erro}</span>
        </div>
      )}

      {/* BARRA DE FILTRO E TOTALIZADORES */}
      <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
            Total: {usuarios.length} usuários
          </span>
          <span style={{ background: 'rgba(2, 132, 199, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
            Admins: {usuarios.filter(u => u.perfil === 'admin').length}
          </span>
          <span style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
            Operadores: {usuarios.filter(u => u.perfil === 'operador').length}
          </span>
          <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.4rem 0.75rem', borderRadius: '6px' }}>
            Auditores: {usuarios.filter(u => u.perfil === 'auditor').length}
          </span>
        </div>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>ID</th>
                <th>Nome do Servidor</th>
                <th>E-mail</th>
                <th>Data de Cadastro</th>
                <th style={{ textAlign: 'center', width: '180px' }}>Nível de Permissão</th>
                <th style={{ textAlign: 'right', width: '150px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u) => {
                const ehProprioUsuario = u.id === usuarioLogado.id;
                return (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{u.nome}</strong>
                        {ehProprioUsuario && (
                          <span style={{ fontSize: '0.68rem', background: '#0284c7', color: '#fff', padding: '1px 6px', borderRadius: '10px' }}>
                            Você
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.criado_em}</td>
                    <td style={{ textAlign: 'center' }}>
                      <select
                        value={u.perfil}
                        disabled={ehProprioUsuario}
                        onChange={(e) => alterarPerfil(u.id, e.target.value, u.nome)}
                        className="form-control"
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.3rem 0.5rem',
                          borderRadius: '6px',
                          cursor: ehProprioUsuario ? 'not-allowed' : 'pointer',
                          background: u.perfil === 'admin' ? 'rgba(2, 132, 199, 0.15)' : u.perfil === 'operador' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: u.perfil === 'admin' ? '#0284c7' : u.perfil === 'operador' ? '#16a34a' : '#d97706',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <option value="operador">Operador (Acesso Total)</option>
                        <option value="auditor">Auditor (Apenas Consulta)</option>
                        <option value="admin">Administrador Geral</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button
                          onClick={() => { setModalSenhaId(u.id); setNovaSenha(''); }}
                          className="btn btn-secondary"
                          title="Redefinir Senha do Usuário"
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                        >
                          <KeyRound size={14} /> Senha
                        </button>

                        <button
                          onClick={() => excluirUsuario(u.id, u.nome)}
                          disabled={ehProprioUsuario || u.email === 'admin@sialm.local'}
                          className="btn btn-danger"
                          title="Excluir Usuário"
                          style={{ padding: '0.35rem 0.55rem', opacity: (ehProprioUsuario || u.email === 'admin@sialm.local') ? 0.4 : 1, cursor: (ehProprioUsuario || u.email === 'admin@sialm.local') ? 'not-allowed' : 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtrados.length === 0 && !carregando && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA REDEFINIR SENHA */}
      {modalSenhaId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <form onSubmit={salvarNovaSenha} className="card" style={{ width: '100%', maxWidth: '380px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Redefinir Senha de Acesso
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Digite uma nova senha provisória para este usuário.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Nova Senha (Mínimo 6 dígitos)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setModalSenhaId(null)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvandoSenha} className="btn btn-primary">
                {salvandoSenha ? 'Salvando...' : 'Confirmar Nova Senha'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}