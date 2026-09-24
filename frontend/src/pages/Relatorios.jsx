import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Printer, Download, Filter, RotateCcw } from 'lucide-react';

export default function Relatorios() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [setores, setSetores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const agora = new Date();
  const [setorId, setSetorId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [mes, setMes] = useState(String(agora.getMonth() + 1));
  const [ano, setAno] = useState(String(agora.getFullYear()));

  useEffect(() => {
    api.get('/movimentacoes').then((res) => setMovimentacoes(res.data.filter((m) => m.tipo === 'saida')));
    api.get('/setores').then((res) => setSetores(res.data));
    api.get('/produtos').then((res) => setProdutos(res.data));
  }, []);

  const meses = [
    { num: '0', nome: 'Todos os Meses' },
    { num: '1', nome: 'Janeiro' },
    { num: '2', nome: 'Fevereiro' },
    { num: '3', nome: 'Março' },
    { num: '4', nome: 'Abril' },
    { num: '5', nome: 'Maio' },
    { num: '6', nome: 'Junho' },
    { num: '7', nome: 'Julho' },
    { num: '8', nome: 'Agosto' },
    { num: '9', nome: 'Setembro' },
    { num: '10', nome: 'Outubro' },
    { num: '11', nome: 'Novembro' },
    { num: '12', nome: 'Dezembro' },
  ];

  const filtradas = movimentacoes.filter((m) => {
    const bateuSetor = !setorId || String(m.setor_id) === String(setorId);
    const bateuProd = !produtoId || String(m.produto_id) === String(produtoId);

    // Formato de data esperado: "DD/MM/YYYY HH:MM"
    let bateuData = true;
    if (m.data && (mes !== '0' || ano !== '0')) {
      const partes = m.data.split(' ')[0].split('/');
      const mesMov = parseInt(partes[1], 10);
      const anoMov = parseInt(partes[2], 10);

      if (mes !== '0' && mesMov !== parseInt(mes, 10)) bateuData = false;
      if (ano !== '0' && anoMov !== parseInt(ano, 10)) bateuData = false;
    }

    return bateuSetor && bateuProd && bateuData;
  });

  const totalQuantidade = filtradas.reduce((acc, curr) => acc + (parseInt(curr.quantidade) || 0), 0);

  return (
    <div>
      <style>{`
        @media print {
          aside, .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
          body { background: #fff !important; color: #000 !important; }
          .card { background: #fff !important; border: none !important; padding: 0 !important; }
          .tabela-print th, .tabela-print td { border: 1px solid #000 !important; color: #000 !important; padding: 6px !important; font-size: 9pt !important; }
          .cabecalho-print { display: block !important; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        }
        .cabecalho-print { display: none; }
      `}</style>

      {/* CABEÇALHO TIMBRADO OFICIAL PARA IMPRESSÃO */}
      <div className="cabecalho-print">
        <h2 style={{ fontSize: '11pt', margin: 0, textTransform: 'uppercase' }}>ESTADO DO PIAUÍ &bull; PREFEITURA MUNICIPAL DE LAGOA DO PIAUÍ</h2>
        <h3 style={{ fontSize: '12pt', margin: '4px 0', textTransform: 'uppercase' }}>SECRETARIA MUNICIPAL DE ADMINISTRAÇÃO - ALMOXARIFADO CENTRAL</h3>
        <p style={{ fontSize: '10pt', margin: 0 }}>Relatório Mensal de Fornecimento de Materiais</p>
      </div>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Relatório de Fornecimento</h1>
          <p style={{ color: '#94a3b8' }}>Consulte e emita as saídas filtrando por secretaria, material ou período.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="http://localhost:8001/api/relatorios/exportar-excel" className="btn btn-secondary">
            <Download size={16} /> Excel
          </a>
          <button onClick={() => window.print()} className="btn btn-primary">
            <Printer size={16} /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="card no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Setor Requisitante</label>
          <select value={setorId} onChange={(e) => setSetorId(e.target.value)} className="form-control">
            <option value="">Todos os Setores</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Produto / Artigo</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} className="form-control">
            <option value="">Todos os Materiais</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Mês</label>
          <select value={mes} onChange={(e) => setMes(e.target.value)} className="form-control">
            {meses.map((m) => (
              <option key={m.num} value={m.num}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>Ano</label>
          <select value={ano} onChange={(e) => setAno(e.target.value)} className="form-control">
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        <button
          onClick={() => { setSetorId(''); setProdutoId(''); setMes('0'); }}
          className="btn btn-secondary"
          title="Limpar filtros"
          style={{ height: '40px' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* TOTAIS */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Saídas Localizadas</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{filtradas.length}</h2>
        </div>
        <div className="card">
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Volume Fornecido</span>
          <h2 style={{ fontSize: '1.8rem', color: '#38bdf8', marginTop: '0.25rem' }}>{totalQuantidade} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>itens</span></h2>
        </div>
      </div>

      {/* TABELA DE SAÍDAS */}
      <div className="card">
        <table className="table tabela-print">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Setor Destino</th>
              <th>Material</th>
              <th>Categoria</th>
              <th style={{ textAlign: 'center' }}>Qtd.</th>
              <th>Responsável / NF</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((m) => (
              <tr key={m.id}>
                <td style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{m.data}</td>
                <td style={{ fontWeight: 600, color: '#38bdf8' }}>{m.setor_nome || 'Geral'}</td>
                <td style={{ fontWeight: 600 }}>{m.produto_nome}</td>
                <td>{m.categoria || 'Geral'}</td>
                <td style={{ textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>
                  {m.quantidade} {m.unidade}
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{m.observacao || m.nfe || '-'}</td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2.5rem' }}>
                  Nenhuma saída encontrada para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}