import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { 
  Printer, Download, RotateCcw, AlertCircle, 
  Loader2, ArrowDownLeft, ArrowUpRight, BarChart3 
} from 'lucide-react';

export default function Relatorios() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [setores, setSetores] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [baixandoExcel, setBaixandoExcel] = useState(false);

  // Filtros
  const [tipoOperacao, setTipoOperacao] = useState('todas'); // 'todas', 'entrada', 'saida'
  const [setorId, setSetorId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [mes, setMes] = useState('0'); // 0 = Todos os meses
  const [ano, setAno] = useState('0'); // 0 = Todos os anos

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [resMovs, resSetores, resProds] = await Promise.all([
        api.get('/movimentacoes'),
        api.get('/setores'),
        api.get('/produtos'),
      ]);

      setMovimentacoes(resMovs.data || []);
      setSetores(resSetores.data || []);
      setProdutos(resProds.data || []);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      setErro('Não foi possível conectar à API para obter os dados do relatório.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleBaixarExcel() {
    setBaixandoExcel(true);
    try {
      const params = new URLSearchParams();
      if (tipoOperacao !== 'todas') params.append('tipo', tipoOperacao);
      if (setorId) params.append('setor_id', setorId);
      if (produtoId) params.append('produto_id', produtoId);
      if (mes !== '0') params.append('mes', mes);
      if (ano !== '0') params.append('ano', ano);

      const response = await api.get(`/relatorios/exportar-excel?${params.toString()}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_movimentacoes_${tipoOperacao}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao exportar Excel: ' + (err.response?.data?.detail || err.message));
    } finally {
      setBaixandoExcel(false);
    }
  }

  function extrairMesEAno(dataStr) {
    if (!dataStr) return { mes: null, ano: null };
    if (dataStr.includes('/')) {
      const partes = dataStr.split(' ')[0].split('/');
      if (partes.length >= 3) return { mes: parseInt(partes[1], 10), ano: parseInt(partes[2], 10) };
    }
    if (dataStr.includes('-')) {
      const partes = dataStr.split('T')[0].split(' ')[0].split('-');
      if (partes.length >= 3) return { mes: parseInt(partes[1], 10), ano: parseInt(partes[0], 10) };
    }
    return { mes: null, ano: null };
  }

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
    const tipoStr = String(m.tipo || '').toLowerCase();

    if (tipoOperacao === 'entrada' && !tipoStr.includes('entrada')) return false;
    if (tipoOperacao === 'saida' && !tipoStr.includes('saida')) return false;

    if (setorId && String(m.setor_id) !== String(setorId)) return false;
    if (produtoId && String(m.produto_id) !== String(produtoId)) return false;

    if (mes !== '0' || ano !== '0') {
      const { mes: mesMov, ano: anoMov } = extrairMesEAno(m.data);
      if (mes !== '0' && mesMov !== parseInt(mes, 10)) return false;
      if (ano !== '0' && anoMov !== parseInt(ano, 10)) return false;
    }

    return true;
  });

  const totalEntradasQtd = filtradas
    .filter((m) => String(m.tipo || '').toLowerCase().includes('entrada'))
    .reduce((acc, curr) => acc + (parseInt(curr.quantidade) || 0), 0);

  const totalSaidasQtd = filtradas
    .filter((m) => String(m.tipo || '').toLowerCase().includes('saida'))
    .reduce((acc, curr) => acc + (parseInt(curr.quantidade) || 0), 0);

  const saldoLiquido = totalEntradasQtd - totalSaidasQtd;
  const setorNome = setores.find((s) => String(s.id) === String(setorId))?.nome || 'Todos os Setores';

  function getTituloRelatorio() {
    if (tipoOperacao === 'entrada') return 'RELATÓRIO DE ENTRADAS DE MATERIAIS (ABASTECIMENTO / NOTAS FISCAIS)';
    if (tipoOperacao === 'saida') return 'RELATÓRIO DE SAÍDAS DE MATERIAIS (FORNECIMENTO AOS SETORES)';
    return 'RELATÓRIO CONSOLIDADO DE MOVIMENTAÇÕES (ENTRADAS E SAÍDAS)';
  }

  return (
    <div>
      <style>{`
        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }

        @media print {
          aside, header, .no-print { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
          body { background: #fff !important; color: #000 !important; }
          .card { background: #fff !important; border: none !important; padding: 0 !important; box-shadow: none !important; }
          
          .cabecalho-timbrado-relatorio {
            display: flex !important;
            align-items: center;
            gap: 15px;
            border-bottom: 2px solid #000;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }
          
          .tabela-print th, .tabela-print td {
            border: 1px solid #000 !important;
            color: #000 !important;
            padding: 5px 8px !important;
            font-size: 8.5pt !important;
          }
          .tabela-print th {
            background-color: #f1f5f9 !important;
          }

          .rodape-assinatura-relatorio {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            text-align: center;
            margin-top: 50px;
            font-size: 8.5pt;
          }
        }

        .cabecalho-timbrado-relatorio,
        .rodape-assinatura-relatorio {
          display: none;
        }
      `}</style>

      {/* CABEÇALHO TIMBRADO OFICIAL (IMPRESSÃO) */}
      <div className="cabecalho-timbrado-relatorio">
        <img 
          src="/brasao.png" 
          alt="Brasão" 
          onError={(e) => { e.target.style.display = 'none'; }}
          style={{ width: '65px', height: 'auto', objectFit: 'contain' }}
        />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '10pt', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>ESTADO DO PIAUÍ</h3>
          <h1 style={{ fontSize: '12pt', fontWeight: 900, margin: '2px 0', textTransform: 'uppercase' }}>PREFEITURA MUNICIPAL DE LAGOA DO PIAUÍ</h1>
          <h2 style={{ fontSize: '9pt', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
            SECRETARIA DE ADMINISTRAÇÃO &bull; ALMOXARIFADO CENTRAL
          </h2>
          <p style={{ fontSize: '8.5pt', fontWeight: 800, margin: '4px 0 0 0', textTransform: 'uppercase' }}>
            {getTituloRelatorio()}
          </p>
          <p style={{ fontSize: '8pt', margin: '2px 0 0 0', color: '#333' }}>
            Período: {meses.find((m) => m.num === mes)?.nome} / {ano === '0' ? 'Todos os Anos' : ano} &bull; Setor: {setorNome}
          </p>
        </div>
        <div style={{ width: '65px' }}></div>
      </div>

      {/* TOPO EM TELA */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Relatórios de Movimentação</h1>
          <p style={{ color: 'var(--text-secondary, #94a3b8)' }}>
            Emissão de relatórios de entradas (abastecimento), saídas (distribuição) ou consolidado.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleBaixarExcel} disabled={baixandoExcel} className="btn btn-secondary">
            <Download size={16} /> {baixandoExcel ? 'Gerando...' : 'Exportar Excel'}
          </button>
          <button onClick={() => window.print()} className="btn btn-primary">
            <Printer size={16} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {erro && (
        <div className="no-print" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{erro}</span>
        </div>
      )}

      {/* ABAS DE TIPO DE RELATÓRIO */}
      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTipoOperacao('todas')}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: tipoOperacao === 'todas' ? 'var(--brand-primary, #0284c7)' : 'var(--bg-card)',
            color: tipoOperacao === 'todas' ? '#fff' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <BarChart3 size={16} /> Consolidado (Geral)
        </button>

        <button
          onClick={() => setTipoOperacao('entrada')}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: tipoOperacao === 'entrada' ? '#16a34a' : 'var(--bg-card)',
            color: tipoOperacao === 'entrada' ? '#fff' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <ArrowDownLeft size={16} /> Entradas (Abastecimento)
        </button>

        <button
          onClick={() => setTipoOperacao('saida')}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
            background: tipoOperacao === 'saida' ? '#ea580c' : 'var(--bg-card)',
            color: tipoOperacao === 'saida' ? '#fff' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <ArrowUpRight size={16} /> Saídas (Fornecimento)
        </button>
      </div>

      {/* BARRA DE FILTROS AVANÇADOS */}
      <div className="card no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) auto', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>Setor Destino</label>
          <select value={setorId} onChange={(e) => setSetorId(e.target.value)} className="form-control">
            <option value="">Todos os Setores</option>
            {setores.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>Material / Artigo</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} className="form-control">
            <option value="">Todos os Materiais</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>Mês</label>
          <select value={mes} onChange={(e) => setMes(e.target.value)} className="form-control">
            {meses.map((m) => (
              <option key={m.num} value={m.num}>{m.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginBottom: '0.35rem' }}>Ano</label>
          <select value={ano} onChange={(e) => setAno(e.target.value)} className="form-control">
            <option value="0">Todos os Anos</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>

        <button
          onClick={() => { setTipoOperacao('todas'); setSetorId(''); setProdutoId(''); setMes('0'); setAno('0'); }}
          className="btn btn-secondary"
          title="Limpar todos os filtros"
          style={{ height: '38px', justifyContent: 'center' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* CARDS TOTALIZADORES */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Lançamentos no Período</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '0.25rem' }}>{filtradas.length}</h2>
        </div>

        {(tipoOperacao === 'todas' || tipoOperacao === 'entrada') && (
          <div className="card" style={{ borderLeft: '4px solid #22c55e' }}>
            <span style={{ fontSize: '0.78rem', color: '#22c55e', textTransform: 'uppercase', fontWeight: 700 }}>Volume de Entradas</span>
            <h2 style={{ fontSize: '1.8rem', color: '#22c55e', marginTop: '0.25rem' }}>
              +{totalEntradasQtd} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>itens</span>
            </h2>
          </div>
        )}

        {(tipoOperacao === 'todas' || tipoOperacao === 'saida') && (
          <div className="card" style={{ borderLeft: '4px solid #ea580c' }}>
            <span style={{ fontSize: '0.78rem', color: '#ea580c', textTransform: 'uppercase', fontWeight: 700 }}>Volume de Saídas</span>
            <h2 style={{ fontSize: '1.8rem', color: '#ea580c', marginTop: '0.25rem' }}>
              -{totalSaidasQtd} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>itens</span>
            </h2>
          </div>
        )}

        {tipoOperacao === 'todas' && (
          <div className="card" style={{ borderLeft: `4px solid ${saldoLiquido >= 0 ? '#0284c7' : '#ef4444'}` }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', textTransform: 'uppercase', fontWeight: 600 }}>Balanço do Período</span>
            <h2 style={{ fontSize: '1.8rem', color: saldoLiquido >= 0 ? '#0284c7' : '#ef4444', marginTop: '0.25rem' }}>
              {saldoLiquido >= 0 ? `+${saldoLiquido}` : saldoLiquido} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>itens</span>
            </h2>
          </div>
        )}
      </div>

      {/* TABELA DE RESULTADOS COM ENVOLTÓRIO RESPONSIVO */}
      <div className="card">
        {carregando ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Loader2 size={22} className="animate-spin" /> Carregando registros...
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table tabela-print">
              <thead>
                <tr>
                  <th style={{ width: '130px' }}>Data / Hora</th>
                  <th style={{ width: '90px' }}>Operação</th>
                  <th>Material</th>
                  <th>Categoria</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Qtd.</th>
                  <th>Origem / Destino</th>
                  <th>Doc. / NF / Protocolo</th>
                  <th>Observações / Resp.</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((m) => {
                  const ehSaida = String(m.tipo || '').toLowerCase().includes('saida');
                  return (
                    <tr key={m.id}>
                      <td style={{ color: '#64748b', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>{m.data || '-'}</td>
                      <td>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: ehSaida ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                          color: ehSaida ? '#ef4444' : '#22c55e',
                        }}>
                          {ehSaida ? 'SAÍDA' : 'ENTRADA'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{m.produto_nome}</td>
                      <td style={{ color: '#64748b' }}>{m.categoria || 'Geral'}</td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: ehSaida ? '#ea580c' : '#16a34a' }}>
                        {ehSaida ? `-${m.quantidade}` : `+${m.quantidade}`} {m.unidade}
                      </td>
                      <td style={{ fontWeight: 600, color: ehSaida ? 'var(--brand-primary, #0284c7)' : '#16a34a' }}>
                        {ehSaida ? (m.setor_nome || 'Geral') : (m.observacao ? m.observacao : 'Fornecedor / Almoxarifado Central')}
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{m.nfe || '-'}</td>
                      <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                        {ehSaida ? (m.observacao || '-') : '-'}
                      </td>
                    </tr>
                  );
                })}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '2.5rem' }}>
                      Nenhuma movimentação encontrada para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ASSINATURAS DO RELATÓRIO NA IMPRESSÃO */}
        <div className="rodape-assinatura-relatorio">
          <div>
            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '4px' }}>
              Responsável pelo Almoxarifado Central
            </div>
          </div>
          <div>
            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '4px' }}>
              Secretaria Municipal de Administração e Finanças
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}