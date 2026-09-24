import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Entrada() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([{ produto_id: '', quantidade: 1 }]);
  const [nfe, setNfe] = useState('');
  const [observacao, setObservacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    api.get('/produtos').then((res) => setProdutos(res.data));
  }, []);

  function adicionarLinha() {
    setItens([...itens, { produto_id: '', quantidade: 1 }]);
  }

  function removerLinha(idx) {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== idx));
    }
  }

  function atualizarItem(idx, campo, valor) {
    const copia = [...itens];
    copia[idx][campo] = valor;
    setItens(copia);
  }

  async function salvarEntrada(e) {
    e.preventDefault();
    const itensValidos = itens.filter((i) => i.produto_id && parseInt(i.quantidade) > 0);

    if (itensValidos.length === 0) {
      alert('Selecione pelo menos um material com quantidade maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      await api.post('/movimentacoes/entrada', {
        nfe,
        observacao,
        itens: itensValidos.map((i) => ({
          produto_id: parseInt(i.produto_id),
          quantidade: parseInt(i.quantidade),
        })),
      });

      alert('Entrada de estoque realizada com sucesso!');
      navigate('/estoque');
    } catch (err) {
      alert('Erro ao registrar entrada: ' + (err.response?.data?.detail || err.message));
      setSalvando(false);
    }
  }

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registrar Entrada de Materiais</h1>
        <p style={{ color: '#94a3b8' }}>Recebimento de notas fiscais e abastecimento de múltiplos itens no estoque.</p>
      </div>

      <form onSubmit={salvarEntrada} className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
              Nota Fiscal / Documento de Remessa
            </label>
            <input
              type="text"
              placeholder="Ex: NF-e 9841 / Pregão 014"
              value={nfe}
              onChange={(e) => setNfe(e.target.value)}
              className="form-control"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
              Fornecedor / Origem da Carga
            </label>
            <input
              type="text"
              placeholder="Ex: Papelaria Silva Ltda."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff' }}>Materiais Recebidos</h3>
          <button type="button" onClick={adicionarLinha} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            <Plus size={15} /> Adicionar Outro Item
          </button>
        </div>

        {itens.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <select
              value={item.produto_id}
              onChange={(e) => atualizarItem(idx, 'produto_id', e.target.value)}
              required
              className="form-control"
              style={{ flex: 3 }}
            >
              <option value="">Selecione o produto...</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (Saldo atual: {p.quantidade_estoque} {p.unidade})
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => atualizarItem(idx, 'quantidade', e.target.value)}
              required
              className="form-control"
              style={{ flex: 1, textAlign: 'center' }}
            />

            <button
              type="button"
              onClick={() => removerLinha(idx)}
              className="btn btn-danger"
              style={{ padding: '0.6rem' }}
              title="Remover linha"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          <button type="submit" disabled={salvando} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            <CheckCircle size={18} /> {salvando ? 'Salvando...' : 'Confirmar Entrada no Estoque'}
          </button>
        </div>
      </form>
    </div>
  );
}