### README.md

```markdown
 SIALM - Sistema Integrado de Almoxarifado Municipal

O **SIALM** é uma plataforma desenvolvida para a gestão, controle e rastreabilidade do fluxo de suprimentos, materiais de consumo e bens permanentes da administração pública municipal de Lagoa do Piauí.

---

 🏛️ Arquitetura e Estratégia de Operação

O sistema opera sob uma **arquitetura híbrida e autônoma**, eliminando dependências externas de proxy reverso e garantindo isolamento total de infraestrutura:

* **Convivência com e-SUS PEC:** O sistema opera na porta **`8001`**, não interferindo com as portas `80` e `443` ocupadas pela infraestrutura do e-SUS PEC na rede local.
* **Distribuição Unificada:** O FastAPI gerencia simultaneamente a API REST (`/api/*`) e os ficheiros estáticos do frontend React compilados (`frontend/dist/`), com mecanismo catch-all para suporte nativo ao React Router sem dependência obrigatória do Nginx.
* **Persistência Leve e Segura:** SQLite (`sialm.db`) com integridade referencial, migrações automáticas de esquema e criptografia unidirecional com `bcrypt`.

---

 🛠️ Pilha Tecnológica

* **Backend:** Python 3.10+, FastAPI, Uvicorn, SQLAlchemy.
* **Banco de Dados:** SQLite (`sialm.db`).
* **Segurança:** Hashes de senha `bcrypt`, sanitização de entradas com schemas Pydantic e controle de perfil de acesso (`admin`, `operador`, `auditor`).
* **Frontend:** React, Tailwind CSS, Vite, Lucide Icons e Axios.
* **Orquestração de Processos:** Systemd (Linux Service).

---

 📁 Estrutura de Diretórios

```text
/home/esdras/sialm/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   ├── connection.py    # Conexão SQLite e sessão SQLAlchemy
│   │   │   └── models.py        # Modelos relacionais das tabelas
│   │   ├── routes/              # Módulos de rotas (auth, produtos, setores, etc.)
│   │   ├── schemas.py           # Schemas Pydantic para validação de payload
│   │   └── main.py              # Inicialização, migração, lifespan e entrega SPA
│   ├── requirements.txt         # Dependências Python
│   ├── sialm.db                 # Base de dados relacional ativa
│   └── venv/                    # Ambiente virtual nativo Linux
└── frontend/
    ├── dist/                    # Ficheiros estáticos compilados (produção)
    │   ├── assets/              # Bundles JS e CSS
    │   ├── brasao.png           # Brasão do município
    │   └── index.html           # Ponto de entrada SPA
    ├── src/                     # Código-fonte React
    ├── package.json
    └── vite.config.js

```

---

## 🚀 Instalação e Configuração

### 1. Compilar o Frontend

No ambiente de desenvolvimento ou no servidor:

```bash
cd /home/esdras/sialm/frontend
npm install
npm run build

```

### 2. Configurar o Backend

No servidor de produção:

```bash
cd /home/esdras/sialm/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

```

### 3. Credenciais Padrão de Inicialização

Na primeira execução, o sistema instancia as credenciais de acesso padrão:

* **Administrador:** `admin@sialm.local` | Senha: `admin123`
* **Auditor:** `auditor@sialm.local` | Senha: `auditor123`

---

## ⚙️ Gestão do Serviço Systemd

O serviço do sistema é controlado pelo ficheiro `/etc/systemd/system/sialm.service`:

```bash
# Iniciar / Parar / Reiniciar o serviço
sudo systemctl start sialm
sudo systemctl stop sialm
sudo systemctl restart sialm

# Monitorizar status e logs operacionais
sudo systemctl status sialm
sudo journalctl -u sialm -f

```

---

## 🌐 Endpoints e Acesso

* **Acesso Web:** `http://<IP_DO_SERVIDOR>:8001`
* **Diagnóstico de Saúde (Healthcheck):** `http://<IP_DO_SERVIDOR>:8001/api/status`
* **Documentação Interativa:** `http://<IP_DO_SERVIDOR>:8001/docs`

```

---

### TUTORIAL.md

```markdown
# Manual Operacional do SIALM

Guia de utilização das funcionalidades do Sistema Integrado de Almoxarifado Municipal.

---

## 1. Níveis de Acesso e Permissões

O SIALM categoriza os utilizadores em três perfis operacionais:
* **Administrador (`admin`):** Acesso completo, parametrização do sistema, cadastro e redefinição de utilizadores, gestão de fornecedores, inventário e relatórios.
* **Operador (`operador`):** Acesso à movimentação diária (registro de entradas, despachos/saídas por setor e consulta de saldo).
* **Auditor (`auditor`):** Acesso estritamente de consulta a movimentações, rastreio de transferências e emissão de relatórios gerenciais e balanços.

---

## 2. Fluxo de Parametrização Inicial

Antes de registar entradas e saídas, cadastre os nós estruturais na seguinte ordem:

```text
[1. Fornecedores] ──> [2. Setores / Secretarias] ──> [3. Catálogo de Produtos]

```

### A. Cadastro de Fornecedores

1. Aceda ao menu **Fornecedores**.
2. Clique em **Novo Fornecedor**.
3. Preencha a Razão Social, CNPJ (obrigatório e único), Telefone e Dados de Contato.
4. Salve o registo.

### B. Cadastro de Setores e Secretarias

1. Aceda ao menu **Setores**.
2. Cadastre cada unidade administrativa (ex: *UBS Centro*, *Secretaria Municipal de Educação*, *Almoxarifado Central*).
3. Informe a Secretaria correspondente e o Servidor Responsável pela retirada.

### C. Cadastro de Produtos e Materiais

1. Aceda ao menu **Produtos**.
2. Clique em **Cadastrar Produto**.
3. Forneça a descrição oficial do item, unidade de medida (Fardo, Caixa, Unidade, Litro), Categoria e o **Estoque Mínimo** (valor de gatilho para os alertas de reposição).

---

## 3. Gestão Diária de Estoque

### A. Registro de Entradas (Recebimento)

1. Vá para **Movimentações** > **Registrar Entrada**.
2. Selecione o Fornecedor que realizou a entrega.
3. Insira o Número da Nota Fiscal (NF) ou Ordem de Fornecimento.
4. Adicione os itens e as quantidades recebidas.
5. O saldo físico do produto no sistema será incrementado imediatamente.

### B. Registro de Saídas (Atendimento de Requisições)

1. Vá para **Movimentações** > **Registrar Saída**.
2. Selecione o **Setor Solicitante** e o responsável pela retirada.
3. Adicione os produtos e quantidades.
4. *Validação:* O sistema impede baixas superiores ao saldo real disponível em estoque.
5. Confirme o registro para decrementar o saldo e gerar o comprovante de saída.

---

## 4. Emissão de Relatórios e Auditoria

1. Aceda ao menu **Relatórios**.
2. **Filtros Disponíveis:**
* Intervalo de datas.
* Agrupamento por Secretaria ou Setor específico.
* Filtro por categoria de produto (ex: Material de Limpeza, Expediente, Farmácia).


3. **Exportação:** Clique em **Exportar para Excel (XLSX)** ou **Imprimir (PDF)** para obter as folhas de consolidação com o brasão oficial municipal no cabeçalho.

---

## 5. Gestão de Contas de Utilizadores (Exclusivo Admin)

1. No menu lateral, aceda a **Usuários**.
2. Crie novas credenciais para os operadores municipais associando e-mail, nome e perfil.
3. Para redefinir a senha de um operador que a tenha esquecido, clique no botão de edição do usuário e defina a nova chave de acesso.

```

---

### MANUTENCAO.md

```markdown
# Guia de Manutenção, Diagnóstico e Resolução de Problemas

Manual de suporte técnico e sustentação da infraestrutura do SIALM.

---

## 1. Rotinas Preventivas Obrigatórias

### A. Backup Diário Automatizado do Banco SQLite
Como o banco reside no ficheiro `sialm.db`, backups consistentes devem ser executados através da API de backup do SQLite (evitando copiar ficheiros com escritas ativas).

Crie o script em `/home/esdras/backup_sialm.sh`:
```bash
#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
ORIGEM="/home/esdras/sialm/backend/sialm.db"
DESTINO="/home/esdras/backups_sialm"

mkdir -p $DESTINO
sqlite3 "$ORIGEM" ".backup '$DESTINO/sialm_backup_$DATA.db'"
# Mantém apenas os últimos 30 backups
find $DESTINO -type f -name "sialm_backup_*.db" -mtime +30 -delete

```

Torne-o executável e adicione à cron:

```bash
chmod +x /home/esdras/backup_sialm.sh
crontab -e
# Executa todos os dias às 22:00
0 22 * * * /home/esdras/backup_sialm.sh

```

---

## 2. Resolução de Incidentes Comuns (Troubleshooting)

### Falha 1: Erro `[Errno 98] Address already in use` (Porta 8001 Travada)

* **Sintoma:** O serviço entra em loop de reinicialização (`activating (auto-restart)`).
* **Causa:** Processo anterior do Uvicorn ou Python não foi encerrado corretamente e segura o socket TCP.
* **Resolução:**
```bash
sudo systemctl stop sialm
sudo fuser -k 8001/tcp
sudo pkill -9 -f uvicorn
sudo systemctl start sialm

```



---

### Falha 2: Erro `203/EXEC` no Status do Systemd

* **Sintoma:** O systemd falha imediatamente ao iniciar com o código `status=203/EXEC`.
* **Causa:** O ambiente virtual `venv` foi movido, copiado do Windows ou o caminho do interpretador Python está corrompido.
* **Resolução:**
```bash
cd /home/esdras/sialm/backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
chmod -R 755 venv/bin
sudo systemctl restart sialm

```



---

### Falha 3: Navegador exibe `{"detail":"Not Found"}` na raiz `/`

* **Sintoma:** O backend responde, mas a tela visual do React não carrega.
* **Causa:** A pasta `frontend/dist` está ausente, incompleta ou sem permissão de leitura.
* **Resolução:**
1. Verifique se o ficheiro `index.html` existe no caminho:
```bash
ls -la /home/esdras/sialm/frontend/dist/index.html

```


2. Caso não exista, recompile o projeto:
```bash
cd /home/esdras/sialm/frontend
npm run build

```


3. Ajuste as permissões de leitura:
```bash
chmod -R 755 /home/esdras/sialm/frontend/dist
sudo systemctl restart sialm

```





---

### Falha 4: Erro de Permissão no Banco `PermissionError: [Errno 13]`

* **Sintoma:** O sistema abre o login, mas ao tentar autenticar ou gravar dados ocorre erro 500.
* **Causa:** O ficheiro `sialm.db` ou o diretório `backend` ficou com permissão restrita a outro utilizador (ex: `root`).
* **Resolução:**
```bash
sudo chown -R esdras:www-data /home/esdras/sialm/backend
chmod 775 /home/esdras/sialm/backend
chmod 664 /home/esdras/sialm/backend/sialm.db
# Se existirem ficheiros temporários bloqueados:
rm -f /home/esdras/sialm/backend/sialm.db-journal
rm -f /home/esdras/sialm/backend/sialm.db-wal
sudo systemctl restart sialm

```



---

### Falha 5: Redefinição Emergencial da Senha do Administrador

Caso o acesso à conta principal seja perdido, redefina o hash diretamente via terminal:

```bash
cd /home/esdras/sialm/backend
source venv/bin/activate

python3 -c "
import sqlite3, bcrypt
conn = sqlite3.connect('sialm.db')
c = conn.cursor()
novo_hash = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
c.execute(\"UPDATE usuarios SET senha_hash = ?, perfil = 'admin' WHERE email = 'admin@sialm.local'\", (novo_hash,))
conn.commit()
conn.close()
print('[OK] Senha de admin@sialm.local redefinida para admin123')
"

```

---

## 3. Procedimento Padrão para Atualização do Sistema (Deploy)

Sempre que novas funcionalidades forem adicionadas ao repositório Git, execute a atualização sem indisponibilidade:

```bash
# 1. Parar o serviço antes de sincronizar
sudo systemctl stop sialm

# 2. Atualizar o código do repositório
cd /home/esdras/sialm
git pull origin main

# 3. Se houver alterações no frontend, compilar nova versão
cd frontend
npm install
npm run build

# 4. Se houver alterações no backend, atualizar bibliotecas
cd ../backend
source venv/bin/activate
pip install -r requirements.txt

# 5. Ajustar permissões e reiniciar o serviço
sudo chown -R esdras:www-data /home/esdras/sialm
chmod -R 755 /home/esdras/sialm/frontend/dist
sudo systemctl start sialm
sudo systemctl status sialm

```

```

```
