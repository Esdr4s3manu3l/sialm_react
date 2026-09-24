import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Truck, Plus, Trash2, Search, Phone, Mail, MapPin, Building } from 'lucide-react';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Campos do formulário
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    api.get('/fornecedores').then((res) => setFornecedores(res.data));
  }

  async function registarFornecedor(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.post('/fornecedores', {
        razao_social: razaoSocial,
        nome_fantasia: nomeFantasia,
        cnpj,
        telefone,
        email,
        endereco
      });
      setRazaoSocial('');
      setNomeFantasia('');
      setCnpj('');
      setTelefone('');
      setEmail('');
      setEndereco('');
      setModalAberto(false);
      carregar();
    } catch (err) {
      alert('Erro ao registar fornecedor: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirFornecedor(id, nome) {
    if (!confirm(`Confirma a remoção do fornecedor "${nome}"?`)) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      carregar();
    } catch (err) {
      alert('Erro ao remover: ' + (err.response?.data?.detail || err.message));
    }
  }

  const filtrados = fornecedores.filter((f) =>
    f.razao_social.toLowerCase().includes(busca.toLowerCase()) ||
    (f.nome_fantasia && f.nome_fantasia.toLowerCase().includes(busca.toLowerCase())) ||
    f.cnpj.includes(busca)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registo de Fornecedores</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Empresas fornecedoras e postos conveniados de Lagoa do Piauí.</p>
        </div>
        <button onClick={() => setModalAberto(true)} className="btn btn-primary">
          <Plus size={16} /> Novo Fornecedor
        </button>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Pesquisar por Razão Social, Nome Fantasia ou CNPJ..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="form-control"
          style={{ border: 'none', background: 'transparent', padding: '0.4rem 0' }}
        />
      </div>

      {/* TABELA DE FORNECEDORES */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Razão Social / Nome Fantasia</th>
                <th>CNPJ</th>
                <th>Contacto</th>
                <th>Endereço</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((f) => (
                <tr key={f.id}>
                  <td>
                    <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{f.razao_social}</strong>
                    {f.nome_fantasia && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)' }}>{f.nome_fantasia}</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{f.cnpj}</td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {f.telefone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {f.telefone}</div>}
                    {f.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}><Mail size={12} /> {f.email}</div>}
                    {!f.telefone && !f.email && '-'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{f.endereco || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => excluirFornecedor(f.id, f.razao_social)} className="btn btn-danger" style={{ padding: '4px 8px' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    Nenhum fornecedor registado ou encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO */}
      {modalAberto && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <form onSubmit={registarFornecedor} className="card" style={{ width: '100%', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>Registar Novo Fornecedor</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Razão Social *</label>
                <input
                  required
                  placeholder="Ex: Comercial Distribuidora de Alimentos Ltda."
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Nome Fantasia</label>
                <input
                  placeholder="Ex: Posto Central / Papelaria Silva"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>CNPJ *</label>
                  <input
                    required
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Telefone / Contacto</label>
                  <input
                    placeholder="(86) 99999-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>E-mail Comercial</label>
                <input
                  type="email"
                  placeholder="fornecedor@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Endereço / Município</label>
                <input
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setModalAberto(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" disabled={salvando} className="btn btn-primary">
                {salvando ? 'A guardar...' : 'Guardar Fornecedor'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}