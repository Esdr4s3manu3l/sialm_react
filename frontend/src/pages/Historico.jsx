import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Printer, Trash2 } from 'lucide-react';
import ReciboModal from '../components/ReciboModal';

export default function Historico() {
  const [movs, setMovs] = useState([]);
  const [setores, setSetores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [setorId, setSetorId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [busca, setBusca] = useState('');
  const [reciboId, setReciboId] = useState(null);

  useEffect(() => {
    carregar();
    api.get('/setores').then(res => setSetores(res.data));
    api.get('/produtos').then(res => setProdutos(res.data));
  }, []);

  function carregar() {
    api.get('/movimentacoes').then(res => setMovs(res.data));
  }

  const filtradas = movs.filter(m => {
    const bateuTipo = !tipo || m.tipo === tipo;
    const bateuSetor = !setorId || String(m.setor_id) === String(setorId);
    const bateuProd = !produtoId || String(m.produto_id) === String(produtoId);
    const termo = busca.toLowerCase();
    const bateuBusca = !termo || m.produto_nome.toLowerCase().includes(termo) || (m.setor_nome && m.setor_nome.toLowerCase().includes(termo)) || (m.nfe && m.nfe.toLowerCase().includes(termo));
    return bateuTipo && bateuSetor && bateuProd && bateuBusca;
  });

  async function estornar(id) {
    if (!confirm('Deseja estornar esta movimentação? O saldo será revertido.')) return;
    await api.delete(`/movimentacoes/${id}`);
    carregar();
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Entradas e Saídas</h1>

      {/* FILTROS */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="form-control">
          <option value="">Todas as Operações</option>
          <option value="entrada">Entradas</option>
          <option value="saida">Saídas</option>
        </select>

        <select value={setorId} onChange={e => setSetorId(e.target.value)} className="form-control">
          <option value="">Todos os Setores</option>
          {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>

        <select value={produtoId} onChange={e => setProdutoId(e.target.value)} className="form-control">
          <option value="">Todos os Produtos</option>
          {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>

        <input type="text" placeholder="Busca geral..." value={busca} onChange={e => setBusca(e.target.value)} className="form-control" />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Data/Hora</th><th>Tipo</th><th>Material</th><th>Qtd</th><th>Setor/Origem</th><th>Detalhes</th><th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map(m => (
              <tr key={m.id}>
                <td style={{ color: '#94a3b8' }}>{m.data}</td>
                <td>
                  <span style={{ color: m.tipo === 'saida' ? '#ef4444' : '#22c55e', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                    {m.tipo}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{m.produto_nome}</td>
                <td><strong>{m.quantidade} {m.unidade}</strong></td>
                <td style={{ color: '#38bdf8' }}>{m.setor_nome || 'N/A'}</td>
                <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{m.observacao || m.nfe || '-'}</td>
                <td style={{ textAlign: 'right' }}>
                  {m.tipo === 'saida' && (
                    <button onClick={() => setReciboId(String(m.id))} className="btn btn-secondary" style={{ padding: '4px 8px', marginRight: '4px' }}><Printer size={14} /></button>
                  )}
                  <button onClick={() => estornar(m.id)} className="btn btn-danger" style={{ padding: '4px 8px' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reciboId && <ReciboModal ids={reciboId} onClose={() => setReciboId(null)} />}
    </div>
  );
}