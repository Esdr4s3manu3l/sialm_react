import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Layout e Estrutura Global
import Layout from './components/Layout';

// Páginas Públicas
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Páginas Operacionais Autenticadas
import Dashboard from './pages/Dashboard';
import Estoque from './pages/Estoque';
import Entrada from './pages/Entrada';
import Saida from './pages/Saida';
import Historico from './pages/Historico';
import Setores from './pages/Setores';
import Fornecedores from './pages/Fornecedores';
import Perfil from './pages/Perfil';
import Relatorios from './pages/Relatorios';
import Usuarios from './pages/Usuarios';

// Guarda de Rotas Autenticadas
function PrivateRoute({ children }) {
  const usuario = localStorage.getItem('sialm_user');
  return usuario ? children : <Navigate to="/login" replace />;
}

// Guarda de Rota Exclusiva para o Administrador Geral
function AdminRoute({ children }) {
  try {
    const usuario = JSON.parse(localStorage.getItem('sialm_user') || '{}');
    if ((usuario.perfil || '').toLowerCase() === 'admin') {
      return children;
    }
    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* ROTAS PROTEGIDAS DENTRO DO LAYOUT PRINCIPAL */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    {/* Monitoramento Interno / Painel Geral */}
                    <Route path="/" element={<Dashboard />} />

                    {/* Catálogo de Materiais e Estoque Físico */}
                    <Route path="/estoque" element={<Estoque />} />

                    {/* Recebimento de Cargas / Entrada com NF */}
                    <Route path="/entrada" element={<Entrada />} />

                    {/* Saída de Materiais e Emissão de Recibo Oficial A4 */}
                    <Route path="/saida" element={<Saida />} />

                    {/* Histórico Geral de Entradas e Saídas */}
                    <Route path="/historico" element={<Historico />} />

                    {/* Locais de Estoque / Secretarias Municipais */}
                    <Route path="/setores" element={<Setores />} />

                    {/* Gestão e Cadastro de Fornecedores */}
                    <Route path="/fornecedores" element={<Fornecedores />} />

                    {/* Meu Perfil e Alteração Própria de Senha */}
                    <Route path="/perfil" element={<Perfil />} />

                    {/* Relatórios de Movimentação (Entradas, Saídas e Excel) */}
                    <Route path="/relatorios" element={<Relatorios />} />

                    {/* Controle de Usuários e Permissões (Exclusivo Admin) */}
                    <Route
                      path="/usuarios"
                      element={
                        <AdminRoute>
                          <Usuarios />
                        </AdminRoute>
                      }
                    />

                    {/* Redirecionamento de Segurança para Rotas Desconhecidas */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}