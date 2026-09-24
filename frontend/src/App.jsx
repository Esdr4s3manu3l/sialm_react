import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Entrada from './pages/Entrada';
import Saida from './pages/Saida';
import Historico from './pages/Historico';
import Setores from './pages/Setores';
import Relatorios from './pages/Relatorios';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('sialm_user');
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1329' }}>
              <div className="card" style={{ width: '380px', textAlign: 'center', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>SIALM</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Almoxarifado Central &bull; Lagoa do Piauí</p>
                <button
                  onClick={() => {
                    localStorage.setItem('sialm_user', JSON.stringify({ nome: 'Administrador Geral', perfil: 'admin' }));
                    window.location.href = '/';
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Entrar no Sistema
                </button>
              </div>
            </div>
          }
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/estoque" element={<Estoque />} />
                  <Route path="/entrada" element={<Entrada />} />
                  <Route path="/saida" element={<Saida />} />
                  <Route path="/historico" element={<Historico />} />
                  <Route path="/setores" element={<Setores />} />
                  <Route path="/relatorios" element={<Relatorios />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}