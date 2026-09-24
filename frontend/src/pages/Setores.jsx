import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Building2, Plus, Trash2 } from 'lucide-react';

export default function Setores() {
  const [setores, setSetores] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [secretaria, setSecretaria] = useState('');
  const [responsavel, setResponsavel] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get('/setores').then((res) => setSetores(res.data));
  }

  async function cadastrarSetor(e) {
    e.preventDefault();
    try {
      await api.post('/setores', { nome, secretaria, responsavel });
      setNome('');
      setSecretaria('');
      setResponsavel('');
      setModalAberto(false);
      carregar();
    } catch (err) {
      alert('Erro ao cadastrar setor: ' + (err.response?.data?.detail || err.message));
    }
  }

  async function excluirSetor(id, nomeSetor) {
    if (!confirm(`Deseja remover o setor "${nomeSetor}"?`)) return;
    try {
      await api.delete(`/setores/${id}`);
      carregar();
    } catch (err) {
      alert('Erro ao excluir: ' + (err.response?.data?.detail || err.message));
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Setores e Secretarias</h1>
          <p style={{ color: '#94a3b8' }}>Unidades requisitantes cadastradas no município de Lagoa do Piauí.</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Setor
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Nome da Unidade / Setor</th>
              <th>Secretaria Vinculada</th>
              <th>Responsável</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {setores.map((s) => (
              <tr key={s.id}>
                <td style={{ color: '#94a3b8' }}>#{s.id}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{s.nome}</td>
                <td style={{ color: '#38bdf8' }}>{s.secretaria || 'Administração Geral'}</td>
                <td style={{ color: '#94a3b8' }}>{s.responsavel || '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => excluirSetor(s.id, s.nome)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {setores.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                  Nenhum setor cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={cadastrarSetor} className="card" style={{ width: '450px' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Cadastrar Novo Setor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Nome da Unidade / Setor</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: UBS Central / Escola Municipal"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Secretaria Superior</label>
                <input
                  type="text"
                  placeholder="Ex: Secretaria de Saúde"
                  value={secretaria}
                  onChange={(e) => setSecretaria(e.target.value)}
                  className="form-control"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Responsável / Coordenador</label>
                <input
                  type="text"
                  placeholder="Nome do servidor responsável"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setModalAberto(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Setor
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}