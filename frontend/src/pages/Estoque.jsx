import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Plus, Download, Edit2, Trash2 } from 'lucide-react';

export default function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [filtroCat, setFiltroCat] = useState('');
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);

  useEffect(() => { carregar(); }, []);

  function carregar() {
    api.get('/produtos').then(res => setProdutos(res.data));
  }

  const categorias = Array.from(new Set(produtos.map(p => p.categoria).filter(Boolean)));

  const filtrados = produtos.filter(p => {
    const bateuCat = !filtroCat || p.categoria === filtroCat;
    const termo = busca.toLowerCase();
    const bateuBusca = !termo || p.nome.toLowerCase().includes(termo) || String(p.id).includes(termo);
    return bateuCat && bateuBusca;
  });

  async function salvar(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const dados = {
      nome: fd.get('nome'),
      categoria: fd.get('categoria'),
      unidade: fd.get('unidade'),
      estoque_minimo: parseInt(fd.get('estoque_minimo')) || 5,
    };
    if (editando) {
      await api.put(`/produtos/${editando.id}`, dados);
    } else {
      dados.quantidade_estoque = parseInt(fd.get('quantidade_estoque')) || 0;
      await api.post('/produtos', dados);
    }
    setModalAberto(false);
    setEditando(null);
    carregar();
  }

  async function excluir(id) {
    if (!confirm('Deseja excluir este item?')) return;
    await api.delete(`/produtos/${id}`);
    carregar();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Controle de Estoque</h1>
          <p style={{ color: '#94a3b8' }}>Catálogo e saldos do almoxarifado</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="http://localhost:8001/api/relatorios/exportar-excel" className="btn btn-secondary"><Download size={16} /> Excel</a>
          <button onClick={() => { setEditando(null); setModalAberto(true); }} className="btn btn-primary"><Plus size={16} /> Novo Produto</button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="card" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filtroCat} onChange={e => setFiltroCat(e.target.value)} className="form-control" style={{ maxWidth: '250px' }}>
          <option value="">Todas as Categorias</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="text" placeholder="Buscar por nome ou código..." value={busca} onChange={e => setBusca(e.target.value)} className="form-control" />
      </div>

      {/* TABELA */}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Cód</th><th>Nome</th><th>Categoria</th><th>Unidade</th><th>Saldo</th><th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td style={{ fontWeight: 600 }}>{p.nome}</td>
                <td><span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>{p.categoria}</span></td>
                <td>{p.unidade}</td>
                <td>
                  <span style={{ color: p.quantidade_estoque <= p.estoque_minimo ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                    {p.quantidade_estoque}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => { setEditando(p); setModalAberto(true); }} className="btn btn-secondary" style={{ padding: '4px 8px', marginRight: '4px' }}><Edit2 size={14} /></button>
                  <button onClick={() => excluir(p.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={salvar} className="card" style={{ width: '450px' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input name="nome" defaultValue={editando?.nome} placeholder="Nome do Produto" required className="form-control" />
              <input name="categoria" defaultValue={editando?.categoria} placeholder="Categoria (ex: Limpeza, Expediente)" className="form-control" />
              <select name="unidade" defaultValue={editando?.unidade || 'UN'} className="form-control">
                <option value="UN">UN (Unidade)</option>
                <option value="METRO">METRO</option>
                <option value="CX">CX (Caixa)</option>
                <option value="PCT">PCT (Pacote)</option>
                <option value="KG">KG</option>
                <option value="L">L (Litro)</option>
                <option value="RESMA">RESMA</option>
              </select>
              {!editando && <input type="number" name="quantidade_estoque" placeholder="Saldo Inicial" className="form-control" />}
              <input type="number" name="estoque_minimo" defaultValue={editando?.estoque_minimo || 5} placeholder="Estoque Mínimo" className="form-control" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setModalAberto(false)} className="btn btn-secondary">Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}