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

## 📊 Fluxo operacional

<svg viewBox="0 0 760 120" xmlns="http://www.w3.org/2000/svg" width="100%">
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 6 3, 0 6" fill="#64748B"/>
    </marker>
  </defs>

  {#each [
      {x:20,label:"Fornecedor"},
      {x:180,label:"Entrada (NF)"},
      {x:340,label:"Estoque"},
      {x:500,label:"Saída"},
      {x:640,label:"Setor"}
    ] as step}
    <rect x={step.x} y=30 width=110 height=50 rx=10 fill="#E2E8F0" stroke="#94A3B8"/>
    <text x={step.x+55} y=60 text-anchor=middle font-size=12 fill="#1E293B">{step.label}</text>
  {/each}

  {#each [130,290,450,610] as x}
    <path d={`M ${x} 55 L ${x+50} 55`} stroke="#64748B" stroke-width=2 marker-end="url(#arrow)"/>
  {/each}
</svg>

1. Cadastro de fornecedores.
2. Registro da Nota Fiscal.
3. Entrada automática no estoque.
4. Saída para setor solicitante.
5. Histórico disponível para auditoria.

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
