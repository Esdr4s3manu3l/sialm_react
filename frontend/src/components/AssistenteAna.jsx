import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { X, Send, Minimize2 } from 'lucide-react';

export default function AssistenteAna() {
  const [aberto, setAberto] = useState(false);
  const [usuario, setUsuario] = useState({});
  const [mensagens, setMensagens] = useState([]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);

  function renderizarTexto(texto) {
    if (!texto) return null;
    const linhas = texto.split('\n');

    return linhas.map((linha, lIdx) => {
      const partes = linha.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lIdx} style={{ display: 'block', minHeight: linha.trim() === '' ? '0.5rem' : 'auto' }}>
          {partes.map((parte, pIdx) => {
            if (parte.startsWith('**') && parte.endsWith('**')) {
              return <strong key={pIdx} style={{ fontWeight: 700, color: 'inherit' }}>{parte.slice(2, -2)}</strong>;
            }
            return parte;
          })}
        </span>
      );
    });
  }

  useEffect(() => {
    const userLogado = JSON.parse(localStorage.getItem('sialm_user') || '{}');
    setUsuario(userLogado);

    setMensagens([
      {
        remetente: 'ana',
        texto: `Olá, **${userLogado.nome || 'Administrador Geral'}**! Sou a **Ana**, a sua assistente operacional para o Almoxarifado de Lagoa do Piauí.\n\nEstou conectada à base de dados em tempo real. Pode perguntar sobre saldos, artigos esgotados ou últimas saídas.`
      }
    ]);
  }, []);

  async function enviarPergunta(textoParaEnviar) {
    const pergunta = textoParaEnviar || input;
    if (!pergunta.trim() || carregando) return;

    setMensagens((prev) => [...prev, { remetente: 'user', texto: pergunta }]);
    setInput('');
    setCarregando(true);

    try {
      const res = await api.post('/assistente/chat', { mensagem: pergunta });
      setMensagens((prev) => [...prev, { remetente: 'ana', texto: res.data.resposta }]);
    } catch (err) {
      setMensagens((prev) => [
        ...prev,
        { remetente: 'ana', texto: '⚠️ Não foi possível consultar a base de dados no momento.' }
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="no-print">
      <style>{`
        @media print {
          .no-print, .assistente-flutuante, #btn-abrir-ana, #janela-chat-ana {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      {/* BOTÃO FLUTUANTE */}
      {!aberto && (
        <button
          id="btn-abrir-ana"
          className="assistente-flutuante"
          onClick={() => setAberto(true)}
          style={{
            position: 'fixed',
            bottom: '18px',
            right: '18px',
            background: 'var(--brand-primary, #0284c7)',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '50px',
            padding: '7px 14px 7px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 999
          }}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: '#0f172a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '12px'
          }}>
            Ana
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Ana</span>
        </button>
      )}

      {/* JANELA DE CHAT */}
      {aberto && (
        <div
          id="janela-chat-ana"
          className="assistente-flutuante"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(540px, calc(100vh - 90px))',
            background: 'var(--bg-card, #ffffff)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            border: '1px solid var(--border-color, #cbd5e1)',
            overflow: 'hidden'
          }}
        >
          <div style={{ background: '#0369a1', color: '#fff', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                Ana
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>Ana &bull; Almoxarifado</strong>
                <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>Lagoa do Piauí</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => setAberto(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <Minimize2 size={15} />
              </button>
              <button onClick={() => setAberto(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={17} />
              </button>
            </div>
          </div>

          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', background: 'var(--bg-main, #f8fafc)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mensagens.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.remetente === 'user' ? 'flex-end' : 'flex-start',
                  background: m.remetente === 'user' ? 'var(--brand-primary, #0284c7)' : 'var(--bg-card, #fff)',
                  color: m.remetente === 'user' ? '#fff' : 'var(--text-primary, #1e293b)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '90%',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  border: m.remetente === 'user' ? 'none' : '1px solid var(--border-color, #e2e8f0)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                {renderizarTexto(m.texto)}
              </div>
            ))}
            {carregando && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card, #fff)', color: 'var(--text-secondary)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                Consultando banco...
              </div>
            )}
          </div>

          <div style={{ padding: '6px 10px', background: 'var(--bg-card, #fff)', display: 'flex', gap: '4px', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            <button
              type="button"
              onClick={() => enviarPergunta('Qual o panorama geral do estoque?')}
              style={{ fontSize: '0.7rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '3px 8px', borderRadius: '12px', whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              📊 Panorama
            </button>
            <button
              type="button"
              onClick={() => enviarPergunta('Quais produtos estão com estoque baixo?')}
              style={{ fontSize: '0.7rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '3px 8px', borderRadius: '12px', whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              ⚠️ Estoque Baixo
            </button>
            <button
              type="button"
              onClick={() => enviarPergunta('Quais itens estão zerados?')}
              style={{ fontSize: '0.7rem', background: 'var(--bg-hover)', border: '1px solid var(--border-color)', padding: '3px 8px', borderRadius: '12px', whiteSpace: 'nowrap', cursor: 'pointer', color: 'var(--text-primary)' }}
            >
              🚫 Zerados
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enviarPergunta(); }} style={{ padding: '8px 10px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="text"
              placeholder="Digite sua dúvida..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 8px', fontSize: '0.8rem', outline: 'none', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            />
            <button type="submit" disabled={carregando} style={{ background: '#0284c7', border: 'none', borderRadius: '6px', color: '#fff', padding: '6px 10px', cursor: 'pointer' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}