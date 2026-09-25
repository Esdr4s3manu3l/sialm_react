# 🏛️ SIALM — Sistema Integrado de Almoxarifado Municipal

<div align="center">

Sistema web para gestão de estoque, movimentações, fornecedores e rastreabilidade de materiais da administração pública municipal.

Desenvolvido para a **Prefeitura Municipal de Lagoa do Piauí** utilizando **FastAPI + React + SQLite**.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-Systemd-FCC624?style=for-the-badge&logo=linux&logoColor=black)

</div>

---

## 📋 Sobre o projeto

O **SIALM (Sistema Integrado de Almoxarifado Municipal)** é uma plataforma desenvolvida para controlar o ciclo completo de materiais de consumo e bens permanentes da administração pública.

O sistema registra entradas e saídas de estoque, controla fornecedores e setores municipais, gera relatórios e mantém um histórico auditável das movimentações.

### Principais funcionalidades

- 📦 Cadastro de produtos e materiais.
- 🏢 Cadastro de fornecedores.
- 🏛️ Cadastro de secretarias e setores.
- 📥 Registro de entradas por Nota Fiscal.
- 📤 Registro de saídas por setor responsável.
- 📊 Relatórios gerenciais e exportação.
- 👤 Controle de usuários por perfil.
- 🔍 Auditoria completa das movimentações.

---

## ✨ Tecnologias utilizadas

<table>
<tr>
<td><strong>Backend</strong></td>
<td>FastAPI, SQLAlchemy, Uvicorn, Pydantic, bcrypt</td>
</tr>

<tr>
<td><strong>Frontend</strong></td>
<td>React, Vite, Tailwind CSS, Axios, Lucide Icons</td>
</tr>

<tr>
<td><strong>Banco de Dados</strong></td>
<td>SQLite</td>
</tr>

<tr>
<td><strong>Infraestrutura</strong></td>
<td>Systemd (Linux)</td>
</tr>
</table>

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura simples e independente de Nginx.

<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" width="100%">
  <rect x="20" y="70" width="150" height="80" rx="12" fill="#2563EB"/>
  <text x="95" y="115" fill="white" font-size="16" text-anchor="middle">React + Vite</text>
  <text x="95" y="135" fill="#DBEAFE" font-size="12" text-anchor="middle">Frontend SPA</text>

  <rect x="305" y="70" width="150" height="80" rx="12" fill="#059669"/>
  <text x="380" y="110" fill="white" font-size="16" text-anchor="middle">FastAPI</text>
  <text x="380" y="130" fill="#D1FAE5" font-size="12" text-anchor="middle">API + Static Files</text>

  <rect x="590" y="70" width="150" height="80" rx="12" fill="#0F766E"/>
  <text x="665" y="110" fill="white" font-size="16" text-anchor="middle">SQLite</text>
  <text x="665" y="130" fill="#CCFBF1" font-size="12" text-anchor="middle">sialm.db</text>

  <path d="M170 110 L305 110" stroke="#64748B" stroke-width="3"/>
  <polygon points="305,110 292,102 292,118" fill="#64748B"/>

  <path d="M455 110 L590 110" stroke="#64748B" stroke-width="3"/>
  <polygon points="590,110 577,102 577,118" fill="#64748B"/>
</svg>

### Estratégia de operação

- Porta exclusiva **8001**.
- Compatível com servidores **e-SUS PEC**.
- FastAPI entrega a API REST e o frontend React compilado.
- React Router funciona sem proxy reverso.

---

## 📂 Estrutura do projeto

```text
sialm/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── schemas.py
│   │   └── main.py
│   ├── requirements.txt
│   ├── sialm.db
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── dist/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
├── TUTORIAL.md
└── MANUTENCAO.md
```

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/sialm.git

cd sialm
```

### 2. Backend

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd ../frontend

npm install
npm run build
```

---

## ▶️ Executando o projeto

### Ambiente de desenvolvimento

**Backend**

```bash
cd backend

source venv/bin/activate

uvicorn app.main:app --reload
```

Servidor disponível em:

```text
http://localhost:8001
```

**Frontend**

```bash
cd frontend

npm run dev
```

Servidor Vite:

```text
http://localhost:5173
```

---

### Ambiente de produção

Compile o frontend:

```bash
cd frontend

npm run build
```

Inicie o backend:

```bash
cd ../backend

source venv/bin/activate

uvicorn app.main:app --host 0.0.0.0 --port 8001
```

---

## ⚙️ Serviço Systemd (Produção)

Arquivo:

```text
/etc/systemd/system/sialm.service
```

Comandos úteis:

```bash
sudo systemctl start sialm
sudo systemctl stop sialm
sudo systemctl restart sialm

sudo systemctl status sialm
sudo journalctl -u sialm -f
```

---

## 🌐 Endpoints da API

| Endpoint | Descrição |
|----------|-----------|
| `/api/status` | Health Check |
| `/api/auth/login` | Autenticação |
| `/api/produtos` | Produtos |
| `/api/setores` | Setores |
| `/api/fornecedores` | Fornecedores |
| `/api/movimentacoes` | Entradas e saídas |
| `/docs` | Swagger UI |
| `/redoc` | Documentação ReDoc |

---

## 🔐 Perfis de acesso

<table>
<tr>
  <th>Perfil</th>
  <th>Permissões</th>
</tr>

<tr>
<td>Administrador</td>
<td>Controle total do sistema, usuários, estoque, fornecedores e relatórios.</td>
</tr>

<tr>
<td>Operador</td>
<td>Entradas, saídas e consulta de estoque.</td>
</tr>

<tr>
<td>Auditor</td>
<td>Consulta, rastreamento e emissão de relatórios.</td>
</tr>

</table>

### Credenciais iniciais (primeira execução)

> **Recomendação:** altere as senhas imediatamente após instalar.

| Usuário | Senha |
|---------|--------|
| `admin@sialm.local` | `admin123` |
| `auditor@sialm.local` | `auditor123` |

---

## 🔒 Segurança

O sistema utiliza:

- Hash de senhas com **bcrypt**.
- Validação de payloads com **Pydantic**.
- Controle de acesso baseado em perfis.
- Integridade referencial do banco SQLite.
- Migração automática do esquema na inicialização.

---

## 📊 Fluxo Operacional

O fluxo de movimentação do estoque segue uma sequência única, garantindo rastreabilidade desde o recebimento até a entrega ao setor solicitante.

<div align="center">

<svg width="100%" viewBox="0 0 760 140" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#64748B"/>
    </marker>
  </defs>

  <!-- Fornecedor -->
  <rect x="20" y="35" width="110" height="50" rx="10" fill="#16A34A"/>
  <text x="75" y="65" text-anchor="middle" fill="white" font-size="13" font-family="Arial">Fornecedor</text>

  <!-- Entrada -->
  <rect x="170" y="35" width="120" height="50" rx="10" fill="#2563EB"/>
  <text x="230" y="60" text-anchor="middle" fill="white" font-size="13" font-family="Arial">Entrada</text>
  <text x="230" y="74" text-anchor="middle" fill="#DBEAFE" font-size="11" font-family="Arial">Nota Fiscal</text>

  <!-- Estoque -->
  <rect x="340" y="35" width="110" height="50" rx="10" fill="#EA580C"/>
  <text x="395" y="65" text-anchor="middle" fill="white" font-size="13" font-family="Arial">Estoque</text>

  <!-- Saída -->
  <rect x="500" y="35" width="110" height="50" rx="10" fill="#DC2626"/>
  <text x="555" y="65" text-anchor="middle" fill="white" font-size="13" font-family="Arial">Saída</text>

  <!-- Setor -->
  <rect x="640" y="35" width="100" height="50" rx="10" fill="#7C3AED"/>
  <text x="690" y="65" text-anchor="middle" fill="white" font-size="13" font-family="Arial">Setor</text>

  <!-- Conexões -->
  <line x1="130" y1="60" x2="170" y2="60" stroke="#64748B" stroke-width="2.5" marker-end="url(#arrow)"/>
  <line x1="290" y1="60" x2="340" y2="60" stroke="#64748B" stroke-width="2.5" marker-end="url(#arrow)"/>
  <line x1="450" y1="60" x2="500" y2="60" stroke="#64748B" stroke-width="2.5" marker-end="url(#arrow)"/>
  <line x1="610" y1="60" x2="640" y2="60" stroke="#64748B" stroke-width="2.5" marker-end="url(#arrow)"/>

</svg>

</div>

### Etapas do fluxo

| Etapa | Descrição |
|-------|-----------|
| **1. Fornecedor** | Cadastro do fornecedor responsável pela entrega dos materiais. |
| **2. Entrada (NF)** | Registro da Nota Fiscal e das quantidades recebidas. |
| **3. Estoque** | Atualização automática do saldo físico dos produtos. |
| **4. Saída** | Baixa dos itens para atendimento das requisições dos setores municipais. |
| **5. Setor** | Entrega ao setor solicitante com rastreabilidade do responsável e da movimentação. |

> Todo o histórico de entradas e saídas permanece registrado para fins de auditoria, relatórios e controle patrimonial.
---

## 📦 Banco de dados

O banco principal é um arquivo SQLite.

```text
backend/sialm.db
```

Características:

- Banco embarcado.
- Sem dependência de SGBD externo.
- Fácil backup e restauração.
- Compatível com migração automática.

---

## 💾 Backup recomendado

Backup consistente utilizando a API do SQLite:

```bash
sqlite3 sialm.db ".backup 'backup.db'"
```

Exemplo de automação diária disponível em **MANUTENCAO.md**.

---

## 📚 Documentação adicional

| Documento | Conteúdo |
|-----------|----------|
| `TUTORIAL.md` | Manual do usuário e fluxo operacional. |
| `MANUTENCAO.md` | Backup, deploy e troubleshooting. |

---

## 🛣️ Roadmap

- [x] Autenticação por perfis.
- [x] Cadastro de produtos.
- [x] Controle de fornecedores.
- [x] Movimentações de estoque.
- [x] Relatórios.
- [ ] Dashboard com indicadores.
- [ ] Exportação PDF avançada.
- [ ] Inventário patrimonial.
- [ ] Alertas de estoque mínimo.
- [ ] Histórico de alterações por usuário.

---

## 🤝 Contribuição

1. Faça um Fork.
2. Crie uma branch.

```bash
git checkout -b feature/nova-funcionalidade
```

3. Commit das alterações.

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

4. Envie para seu fork.

```bash
git push origin feature/nova-funcionalidade
```

5. Abra um Pull Request.

---

## 👨‍💻 Autor

**Esdras Emanuel Marques da Silva**

Analista de Suporte Técnico • Prefeitura Municipal de Lagoa do Piauí

Projeto desenvolvido para modernizar a gestão do almoxarifado municipal utilizando tecnologias open source.

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT**.

Veja o arquivo **LICENSE** para mais informações.
