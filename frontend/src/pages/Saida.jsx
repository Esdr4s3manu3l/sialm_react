import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Plus, Trash2 } from 'lucide-react';
import ReciboModal from '../components/ReciboModal';

export default function Saida() {
  const [produtos, setProdutos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [itens, setItens] = useState([{ produto_id: '', quantidade: 1 }]);
  const [reciboIds, setReciboIds] = useState(null);

  useEffect(() => {
    api.get('/produtos').then(res => setProdutos(res.data.filter(p => p.quantidade_estoque > 0)));
    api.get('/setores').then(res => setSetores(res.data));
  }, []);

  function addItem() {
    setItens([...itens, { produto_id: '', quantidade: 1 }]);
  }

  function removeItem(idx) {
    if (itens.length > 1) setItens(itens.filter((_, i) => i !== idx));
  }

  function updateItem(idx, campo, val) {
    const copia = [...itens];
    copia[idx][campo] = val;
    setItens(copia);
  }

  async function registrar(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      setor_id: parseInt(fd.get('setor_id')),
      protocolo: fd.get('protocolo'),
      servidor: fd.get('servidor'),
      itens: itens.map(i => ({ produto_id: parseInt(i.produto_id), quantidade: parseInt(i.quantidade) }))
    };

    try {
      const res = await api.post('/movimentacoes/saida', payload);
      setReciboIds(res.data.ids.join(','));
      setItens([{ produto_id: '', quantidade: 1 }]);
      e.target.reset();
    } catch (err) {
      alert('Erro: ' + (err.response?.data?.detail || err.message));
    }
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Registrar Saída de Materiais</h1>

      <form onSubmit={registrar} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Setor Solicitante</label>
            <select name="setor_id" required className="form-control">
              <option value="">Selecione o setor...</option>
              {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Protocolo / Requisição</label>
            <input name="protocolo" placeholder="Ex: REQ-2026-01" className="form-control" />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Servidor Responsável pela Retirada</label>
          <input name="servidor" required placeholder="Nome e matrícula" className="form-control" />
        </div>

        <h3 style={{ fontSize: '1rem', borderTop: '1px solid #334155', paddingTop: '1rem', marginBottom: '0.5rem' }}>Itens Solicitados</h3>
        {itens.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <select
              value={item.produto_id}
              onChange={e => updateItem(idx, 'produto_id', e.target.value)}
              required
              className="form-control"
              style={{ flex: 3 }}
            >
              <option value="">Selecione o material...</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Saldo: {p.quantidade_estoque} {p.unidade})</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={e => updateItem(idx, 'quantidade', e.target.value)}
              required
              className="form-control"
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => removeItem(idx)} className="btn btn-danger"><Trash2 size={16} /></button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="button" onClick={addItem} className="btn btn-secondary"><Plus size={16} /> Outro Item</button>
          <button type="submit" className="btn btn-primary">Confirmar Saída e Emitir Recibo</button>
        </div>
      </form>

      {reciboIds && <ReciboModal ids={reciboIds} onClose={() => setReciboIds(null)} />}
    </div>
  );
}