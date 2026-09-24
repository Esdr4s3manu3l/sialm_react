import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Package, AlertTriangle, AlertCircle, Building2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [metricas, setMetricas] = useState(null);

  useEffect(() => {
    api.get('/relatorios/metricas-dashboard').then(res => setMetricas(res.data));
  }, []);

  if (!metricas) return <div>Carregando painel...</div>;

  const chartData = {
    labels: ['Mês Vigente'],
    datasets: [
      { label: 'Entradas (Reposição)', data: [metricas.entradas_mes], backgroundColor: '#06b6d4', borderRadius: 6 },
      { label: 'Saídas (Consumo)', data: [metricas.saidas_mes], backgroundColor: '#f59e0b', borderRadius: 6 },
    ],
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Visão Geral</h1>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Resumo operacional do almoxarifado de Lagoa do Piauí.</p>

      {/* CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Package size={32} color="#0284c7" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Cadastrados</span>
            <h2 style={{ fontSize: '1.8rem' }}>{metricas.total_produtos}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle size={32} color="#eab308" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Zerados</span>
            <h2 style={{ fontSize: '1.8rem' }}>{metricas.itens_zerados}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={32} color="#ef4444" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Estoque Baixo</span>
            <h2 style={{ fontSize: '1.8rem', color: metricas.estoque_baixo > 0 ? '#ef4444' : '#fff' }}>{metricas.estoque_baixo}</h2>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Building2 size={32} color="#a855f7" />
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Setores</span>
            <h2 style={{ fontSize: '1.8rem' }}>{metricas.total_setores}</h2>
          </div>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="card" style={{ height: '350px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Balanço Mensal (Entradas vs Saídas)</h3>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}