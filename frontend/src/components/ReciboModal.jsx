import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Printer, X } from 'lucide-react';

export default function ReciboModal({ ids, onClose }) {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    if (ids) {
      api.get(`/movimentacoes/recibo-dados?ids=${ids}`).then((res) => {
        setDados(res.data);
      });
    }
  }, [ids]);

  if (!dados) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', overflowY: 'auto', padding: '2rem' }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #recibo-a4, #recibo-a4 * { visibility: visible; }
          #recibo-a4 { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Barra superior com botões */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => window.print()} className="btn btn-primary"><Printer size={18} /> Imprimir A4</button>
          <button onClick={onClose} className="btn btn-secondary"><X size={18} /> Fechar</button>
        </div>

        {/* FOLHA A4 TIMBRADA */}
        <div id="recibo-a4" style={{ background: '#fff', color: '#000', padding: '30mm 20mm', borderRadius: '4px', minHeight: '297mm', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '13pt', textTransform: 'uppercase', margin: 0 }}>ESTADO DO PIAUÍ</h2>
            <h1 style={{ fontSize: '15pt', textTransform: 'uppercase', margin: '4px 0' }}>PREFEITURA MUNICIPAL DE LAGOA DO PIAUÍ</h1>
            <h3 style={{ fontSize: '11pt', margin: 0, textTransform: 'uppercase' }}>{dados.secretaria} - ALMOXARIFADO CENTRAL</h3>
            <p style={{ fontSize: '10pt', marginTop: '6px', fontWeight: 'bold' }}>RECIBO OFICIAL DE FORNECIMENTO DE MATERIAIS</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '10pt', marginBottom: '20px' }}>
            <div><strong>Destino:</strong> {dados.setor}</div>
            <div><strong>Data:</strong> {dados.data}</div>
            <div><strong>Protocolo/NF:</strong> {dados.protocolo || 'NÃO ESPECIFICADO'}</div>
            <div><strong>Observações:</strong> {dados.observacao || 'N/A'}</div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px', fontSize: '10pt' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #000' }}>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Item</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>Descrição do Material</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Unidade</th>
                <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {dados.itens.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>{item.produto}</td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{item.unidade}</td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ÁREA DE ASSINATURAS */}
          <div style={{ marginTop: '80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', textAlign: 'center', fontSize: '10pt' }}>
            <div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>Responsável pela Entrega<br /><strong>Almoxarifado Municipal</strong></div>
            </div>
            <div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px' }}>Servidor Responsável pelo Recebimento<br /><strong>Assinatura / Matrícula</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}