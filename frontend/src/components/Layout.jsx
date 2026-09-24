import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, Search, Activity, ShieldCheck, 
  Calendar, ShoppingCart, Archive, LogOut, Sun, Moon, 
  Menu, X, UserCog, Truck, User 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import AssistenteAna from './AssistenteAna';

export default function Layout({ children }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { tema, alternarTema } = useTheme();
  const inputBuscaRef = useRef(null);

  const [menuAbertoMobile, setMenuAbertoMobile] = useState(false);
  const [buscaComando, setBuscaComando] = useState('');

  // Carrega dados reais do usuário logado e ouve alterações
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sialm_user')) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    function atualizarUsuarioLocal() {
      try {
        setUser(JSON.parse(localStorage.getItem('sialm_user')) || {});
      } catch {
        setUser({});
      }
    }
    window.addEventListener('storage', atualizarUsuarioLocal);
    return () => window.removeEventListener('storage', atualizarUsuarioLocal);
  }, []);

  // Fecha o menu móvel automaticamente ao navegar
  useEffect(() => {
    setMenuAbertoMobile(false);
  }, [loc.pathname]);

  // Atalho global Ctrl+K / Cmd+K para focar no campo de busca rápida
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputBuscaRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function logout() {
    localStorage.removeItem('sialm_user');
    nav('/login');
  }

  function getIniciais(nome) {
    if (!nome) return 'US';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

  function formatarPerfil(perfil) {
    switch ((perfil || '').toLowerCase()) {
      case 'admin': return 'Administrador Geral';
      case 'auditor': return 'Auditor (Leitura)';
      case 'operador': return 'Operador';
      default: return 'Servidor';
    }
  }

  const ehAdmin = (user.perfil || '').toLowerCase() === 'admin';
  const ehAuditor = (user.perfil || '').toLowerCase() === 'auditor';

  // Definição dos módulos do sistema com controle de permissão (RBAC)
  const menu = [
    { label: 'Monitoramento Interno', path: '/', icon: Activity, grupo: 'Operação' },
    { 
      label: 'Controle de Usuários', 
      path: '/usuarios', 
      icon: UserCog, 
      grupo: 'Operação', 
      apenasAdmin: true 
    },
    { label: 'Fornecedores', path: '/fornecedores', icon: Truck, grupo: 'Frota e recursos' },
    { label: 'Locais de Estoque', path: '/setores', icon: Archive, grupo: 'Frota e recursos' },
    { label: 'Estoque / Catálogo', path: '/estoque', icon: ShoppingCart, grupo: 'Frota e recursos' },
    { 
      label: 'Registrar Entrada', 
      path: '/entrada', 
      icon: Archive, 
      grupo: 'Frota e recursos', 
      bloqueadoParaAuditor: true 
    },
    { 
      label: 'Registrar Saída', 
      path: '/saida', 
      icon: Archive, 
      grupo: 'Frota e recursos', 
      bloqueadoParaAuditor: true 
    },
    { label: 'Entradas e Saídas', path: '/historico', icon: Calendar, grupo: 'Frota e recursos' },
    { label: 'Relatórios', path: '/relatorios', icon: ShieldCheck, grupo: 'Frota e recursos' },
  ];

  // Filtra itens pelo termo de busca e perfil do usuário logado
  const itensFiltrados = menu.filter(item => {
    if (item.apenasAdmin && !ehAdmin) return false;
    if (item.bloqueadoParaAuditor && ehAuditor) return false;
    if (!buscaComando.trim()) return true;
    return item.label.toLowerCase().includes(buscaComando.toLowerCase().trim());
  });

  const itensOperacao = itensFiltrados.filter(m => m.grupo === 'Operação');
  const itensRecursos = itensFiltrados.filter(m => m.grupo === 'Frota e recursos');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>
      
      {/* CORTINA TRANSLÚCIDA NO MOBILE */}
      {menuAbertoMobile && (
        <div 
          onClick={() => setMenuAbertoMobile(false)}
          className="no-print"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 199,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* =========================================================================
          SIDEBAR LATERAL (RESPONSIVA)
          ========================================================================= */}
      <aside 
        className="no-print sidebar-responsiva"
        style={{
          width: '260px',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem 0.85rem',
          zIndex: 200,
          transition: 'transform 0.25s ease-in-out'
        }}
      >
        <style>{`
          @media (max-width: 768px) {
            .sidebar-responsiva {
              position: fixed !important;
              top: 0 !important;
              bottom: 0 !important;
              left: 0 !important;
              transform: ${menuAbertoMobile ? 'translateX(0)' : 'translateX(-100%)'} !important;
              box-shadow: ${menuAbertoMobile ? '0 0 25px rgba(0,0,0,0.5)' : 'none'} !important;
            }
          }
        `}</style>

        {/* LOGOTIPO */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'var(--brand-primary)', padding: '6px', borderRadius: '8px', color: '#fff', display: 'flex' }}>
              <Building2 size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', display: 'block', color: 'var(--text-primary)' }}>CIGM</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Controle Interno Municipal</span>
            </div>
          </div>

          <button
            onClick={() => setMenuAbertoMobile(false)}
            className="mobile-close-btn"
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none' }}
          >
            <X size={20} />
          </button>
          <style>{`
            @media (max-width: 768px) {
              .mobile-close-btn { display: block !important; }
            }
          `}</style>
        </div>

        {/* IDENTIFICAÇÃO DA ENTIDADE ATIVA */}
        <div style={{ background: 'var(--bg-hover)', borderRadius: '8px', padding: '0.75rem', margin: '1rem 0', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Entidade Ativa</span>
          <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'block', marginTop: '2px' }}>MUNICÍPIO DE LAGOA DO PIAUÍ</strong>
          <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', display: 'block', marginTop: '2px', fontWeight: 600 }}>&bull; LAGOA DO PIAUÍ - PI</span>
        </div>

        {/* BUSCA RÁPIDA (CTRL+K) */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, pointerEvents: 'none' }} />
          <input
            ref={inputBuscaRef}
            type="text"
            placeholder="Buscar módulo..."
            value={buscaComando}
            onChange={(e) => setBuscaComando(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 2rem 0.45rem 1.9rem',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>

        {/* NAVEGAÇÃO DOS MÓDULOS */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          {itensOperacao.length > 0 && (
            <>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0.5rem 0.5rem 0.25rem 0.5rem' }}>Operação</span>
              {itensOperacao.map(item => {
                const Icon = item.icon;
                const ativo = loc.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: ativo ? 700 : 500,
                      color: ativo ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      background: ativo ? 'var(--bg-active)' : 'transparent'
                    }}
                  >
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
            </>
          )}

          {itensRecursos.length > 0 && (
            <>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0.8rem 0.5rem 0.25rem 0.5rem' }}>Frota e Recursos</span>
              {itensRecursos.map(item => {
                const Icon = item.icon;
                const ativo = loc.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: ativo ? 700 : 500,
                      color: ativo ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      background: ativo ? 'var(--bg-active)' : 'transparent'
                    }}
                  >
                    <Icon size={16} /> {item.label}
                  </Link>
                );
              })}
            </>
          )}

          {itensFiltrados.length === 0 && (
            <div style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Nenhum módulo encontrado.
            </div>
          )}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            SIALM v2.0 &bull; Lagoa do Piauí
          </span>
        </div>
      </aside>

      {/* =========================================================================
          ÁREA DE CONTEÚDO E HEADER SUPERIOR
          ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden' }}>
        
        {/* HEADER SUPERIOR FIXO */}
        <header 
          className="no-print"
          style={{
            height: '60px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          {/* LADO ESQUERDO: HAMBÚRGUER + CONTEXTO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setMenuAbertoMobile(!menuAbertoMobile)}
              className="btn-hamburguer"
              style={{
                background: 'var(--bg-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '6px',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'none'
              }}
            >
              <Menu size={18} />
            </button>
            <style>{`
              @media (max-width: 768px) {
                .btn-hamburguer { display: flex !important; align-items: center; }
                .header-contexto { display: none !important; }
              }
            `}</style>

            <div className="header-contexto" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Almoxarifado Central
              </span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Lagoa do Piauí
              </span>
            </div>
          </div>

          {/* LADO DIREITO: DADOS DO USUÁRIO (LINK PERFIL), TEMA E BOTÃO DE SAIR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            
            {/* AVATAR E NOME (CLICÁVEL PARA ACESSAR O MEU PERFIL) */}
            <Link
              to="/perfil"
              title="Acessar Meu Perfil e Senha"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingRight: '0.6rem',
                borderRight: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%', 
                background: ehAdmin ? 'var(--brand-primary)' : ehAuditor ? '#f59e0b' : '#16a34a', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '11px', 
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {getIniciais(user.nome)}
              </div>
              <div className="header-user-info" style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '0.78rem', display: 'block', color: 'var(--text-primary)', lineHeight: 1.1, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.nome || 'Admin'}
                </strong>
                <span style={{ fontSize: '0.68rem', color: ehAdmin ? 'var(--brand-primary)' : ehAuditor ? '#f59e0b' : 'var(--text-secondary)' }}>
                  {formatarPerfil(user.perfil)}
                </span>
              </div>
              <style>{`
                @media (max-width: 600px) {
                  .header-user-info { display: none !important; }
                }
              `}</style>
            </Link>

            {/* BOTÃO MODO CLARO / ESCURO */}
            <button
              onClick={alternarTema}
              title={`Alternar para modo ${tema === 'dark' ? 'claro' : 'escuro'}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-hover)',
                color: 'var(--text-primary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tema === 'dark' ? <Moon size={15} color="var(--brand-accent, #38bdf8)" /> : <Sun size={15} color="#eab308" />}
              <span className="btn-tema-label">{tema === 'dark' ? 'Escuro' : 'Claro'}</span>
              <style>{`
                @media (max-width: 480px) {
                  .btn-tema-label { display: none !important; }
                }
              `}</style>
            </button>

            {/* BOTÃO SAIR (POSICIONADO APÓS O TEMA) */}
            <button
              onClick={logout}
              title="Sair do sistema"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.7rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span className="btn-sair-label">Sair</span>
              <style>{`
                @media (max-width: 480px) {
                  .btn-sair-label { display: none !important; }
                }
              `}</style>
            </button>

          </div>
        </header>

        {/* CORPO PRINCIPAL */}
        <main style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
          {children}
        </main>

      </div>

      {/* ASSISTENTE ANA */}
      <AssistenteAna />
    </div>
  );
}