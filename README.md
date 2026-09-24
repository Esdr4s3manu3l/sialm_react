<div align="center">

# 📦 SIALM — Sistema Integrado de Almoxarifado Municipal

**Solução moderna e desacoplada para gestão, auditoria e fornecimento de suprimentos municipais.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![Python](https://img.shields.io/badge/Python_3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

</div>

---

## 📌 Visão Geral

O **SIALM** é uma aplicação web corporativa desenvolvida para digitalizar e otimizar o fluxo operacional do Almoxarifado Central da Prefeitura Municipal de Lagoa do Piauí. O sistema substitui o controle descentralizado e formulários manuais por uma plataforma centralizada com rastreabilidade completa de insumos, auditoria de retiradas e controle quantitativo em tempo real.

O projeto passou por uma migração estrutural de uma arquitetura legada baseada em templates monolíticos (*Jinja2*) para uma arquitetura **desacoplada (SPA + REST API)**, aumentando a responsividade, a manutenibilidade e a experiência de uso das secretarias requisitantes.

---

## 🚀 Tecnologias Empregadas

### **Frontend (SPA)**
* **React 18 & Vite:** Interface reativa, modular e de carregamento instantâneo.
* **React Router:** Roteamento client-side com proteção de rotas e perfis de acesso.
* **Chart.js & React-Chartjs-2:** Visualização analítica do balanço mensal de reposições e consumos.
* **Lucide React:** Biblioteca consistente de ícones vetoriais.
* **Axios:** Cliente HTTP com interceptors e integração de endpoints REST.
* **CSS3 Custom Rules & Print Media:** Estilos encapsulados com suporte nativo a impressão oficial em folha timbrada padrão A4.

### **Backend (REST API)**
* **FastAPI:** Framework assíncrono de alta performance para a construção da API.
* **SQLAlchemy 2.0:** Mapeamento Objeto-Relacional (ORM) robusto para operações relacionais.
* **Pydantic v2:** Validação rigorosa de esquemas de entrada e serialização de dados.
* **Bcrypt:** Algoritmo seguro de hashing para proteção de senhas de usuários.
* **Pandas & OpenPyXL:** Mecanismo de exportação de dados analíticos para planilhas `.xlsx`.
* **SQLite:** Banco relacional configurado para portabilidade e execução transacional segura.

### **Infraestrutura & DevOps**
* **Nginx:** Servidor web reverso de alta concorrência entregando o bundle estático do frontend e roteando o tráfego da API.
* **Systemd:** Gerenciamento do daemon Uvicorn no Linux com reinicialização automática contra falhas.

---

## 🎯 Principais Funcionalidades

- [x] **Painel de Controle Analítico (Dashboard):** Métricas consolidadas de itens zerados, produtos abaixo do estoque mínimo, total de secretarias atendidas e balanço mensal interativo.
- [x] **Gestão de Materiais & Saldo Dinâmico:** Catálogo de insumos com filtro em tempo real por categoria, busca textual com tolerância e suporte a múltiplas unidades de medida (`UN`, `METRO`, `CX`, `PCT`, `KG`, `L`, `RESMA`).
- [x] **Entrada em Lote (Multi-Item):** Lançamento agrupado de remessas e notas fiscais com múltiplos produtos em uma única transação atômica.
- [x] **Saída / Fornecimento com Emissão de Recibo:** Distribuição de materiais para secretarias com validação automática de estoque mínimo disponível e gravação de servidor requisitante.
- [x] **Recibo Oficial A4:** Geração instantânea de comprovante de entrega no formato A4 com layout timbrado, detalhamento da remessa e campos de assinatura para prestação de contas.
- [x] **Histórico Auditável e Estorno Seguro:** Registro imutável de todas as movimentações com opção de cancelamento/estorno que recompõe automaticamente os saldos do estoque.
- [x] **Filtros Avançados & Relatórios:** Consulta por período (mês/ano), secretaria requisitante ou produto específico, com exportação analítica para Excel.
- [x] **Controle de Acesso Baseado em Papéis (RBAC):**
  * `Admin`: Gestão completa (entradas, saídas, edições, exclusões e cadastros).
  * `Auditor`: Acesso exclusivo para leitura, relatórios e conferência contábil municipal.

---

## 🏛️ Arquitetura do Sistema

```text
               +----------------------------------+
               |     Navegador do Usuário         |
               +-----------------+----------------+
                                 |
                          Porta 80 (HTTP)
                                 v
               +-----------------+----------------+
               |          Nginx Server            |
               +-----------------+----------------+
                                 |
              +------------------+------------------+
              |                                     |
    Arquivos Estáticos (/dist)                 Proxy Reverso (/api/*)
              v                                     v
     [ React 18 SPA (Vite) ]               [ FastAPI + Uvicorn ]
    (Dashboard, Telas, Recibo)                  (Porta 8001)
                                                    |
                                             SQLAlchemy ORM
                                                    |
                                                    v
                                            [( sialm.db )]
```

---

## 📂 Estrutura de Diretórios

```text
sialm/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── connection.py    # Configuração da engine SQLite e SessionMaker
│   │   │   └── models.py        # Modelos relacionais (Usuario, Setor, Produto, Movimentacao)
│   │   ├── routes/
│   │   │   ├── auth.py          # Autenticação e sessão de usuários
│   │   │   ├── produtos.py      # CRUD de estoque e regras de saldo
│   │   │   ├── setores.py       # Gerenciamento de secretarias e departamentos
│   │   │   ├── movimentacoes.py # Lógica transacional de entradas, saídas e estornos
│   │   │   └── relatorios.py    # Agregações, métricas da dashboard e exportação Excel
│   │   ├── schemas.py           # Esquemas Pydantic para validação das requisições
│   │   └── main.py              # Ponto de entrada FastAPI, CORS e migração de colunas
│   ├── requirements.txt         # Dependências do ecossistema Python
│   └── sialm.db                 # Banco de dados operacional
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.js        # Configuração centralizada do Axios
    │   ├── components/
    │   │   ├── Layout.jsx       # Barra lateral de navegação e cabeçalho do usuário
    │   │   └── ReciboModal.jsx  # Componente com layout A4 para impressão oficial
    │   ├── pages/
    │   │   ├── Dashboard.jsx    # Gráfico de barras e cards indicadores
    │   │   ├── Estoque.jsx      # Tabela com busca, filtros de categoria e edição
    │   │   ├── Entrada.jsx      # Formulário de entrada em lote
    │   │   ├── Saida.jsx        # Fornecimento para secretarias com emissão de recibo
    │   │   ├── Historico.jsx    # Log geral de movimentações e cancelamento
    │   │   ├── Setores.jsx      # Cadastro e listagem de secretarias
    │   │   └── Relatorios.jsx   # Filtros combinados por data/setor e exportações
    │   ├── App.jsx              # Definição e proteção de rotas
    │   └── index.css            # Estilos globais e tema dark corporativo
    ├── package.json
    └── vite.config.js
```

---

## 💻 Instalação e Execução Local

### Pré-requisitos
* **Python 3.10+**
* **Node.js 18+** e **npm**
* **Git**

### 1. Clonar o Repositório
```bash
git clone https://github.com/SEU_USUARIO/sialm.git
cd sialm
```

### 2. Configurar o Backend
```bash
cd backend
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

# Iniciar o servidor da API (porta 8001):
uvicorn app.main:app --reload --port 8001
```

### 3. Configurar o Frontend
Em outro terminal:
```bash
cd frontend
npm install

# Iniciar o servidor de desenvolvimento do Vite:
npm run dev
```

Acesse a interface através de **`http://localhost:5173`**.

---

## 🔒 Credenciais Padrão (Ambiente de Testes)

O sistema conta com rotina de seed automático no primeiro arranque:

| Usuário | E-mail | Senha Padrão | Perfil |
| :--- | :--- | :--- | :--- |
| Administrador Geral | `admin@sialm.local` | `admin123` | Total (`admin`) |
| Auditoria Municipal | `auditor@sialm.local` | `auditor123` | Somente Leitura (`auditor`) |

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte `LICENSE` para obter mais detalhes.

<div align="center">

Desenvolvido para modernização da gestão pública municipal.

</div>