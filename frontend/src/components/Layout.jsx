import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowDownLeft, ArrowUpRight, History, Building2, BarChart2, LogOut } from 'lucide-react';

export default function Layout({ children }) {
  const loc = useLocation();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('sialm_user') || '{}');

  const menu = [
    { label: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { label: 'Estoque', path: '/estoque', icon: Package },
    { label: 'Registrar Entrada', path: '/entrada', icon: ArrowDownLeft, hideAuditor: true },
    { label: 'Registrar Saída', path: '/saida', icon: ArrowUpRight, hideAuditor: true },
    { label: 'Entradas e Saídas', path: '/historico', icon: History },
    { label: 'Setores', path: '/setores', icon: Building2 },
    { label: 'Relatórios', path: '/relatorios', icon: BarChart2 },
  ];

  function logout() {
    localStorage.removeItem('sialm_user');
    nav('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside style={{ width: '250px', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package style={{ width: 32, height: 32, color: '#38bdf8' }} />
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>SIALM</h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Lagoa do Piauí</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {menu.map((item) => {
            if (item.hideAuditor && user.perfil === 'auditor') return null;
            const Icon = item.icon;
            const ativo = loc.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: ativo ? '#fff' : '#94a3b8',
                  background: ativo ? '#0284c7' : 'transparent',
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{user.nome || 'Usuário'}</p>
            <p style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase' }}>{user.perfil || 'Admin'}</p>
          </div>
          <button onClick={logout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}