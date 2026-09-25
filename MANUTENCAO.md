# 🛠️ MANUTENÇÃO DO SIALM

Guia oficial de manutenção, backup, atualização, monitoramento e resolução de problemas do **SIALM (Sistema Integrado de Almoxarifado Municipal)**.

Este documento é destinado aos administradores do servidor Linux responsáveis pela infraestrutura da aplicação.

---

## 📑 Índice

- [Estrutura da Instalação](#-1-estrutura-da-instalação)
- [Rotinas Preventivas](#-2-rotinas-preventivas)
- [Backup Automático](#-21-backup-automático-do-banco-sqlite)
- [Atualização do Sistema](#-3-atualização-do-sistema-deploy)
- [Gerenciamento do Serviço](#-4-gerenciamento-do-serviço-systemd)
- [Monitoramento e Logs](#-5-monitoramento-e-logs)
- [Troubleshooting](#-6-resolução-de-problemas)
- [Recuperação de Emergência](#-7-recuperação-de-emergência)

---

# 📁 1. Estrutura da Instalação

A instalação recomendada do SIALM utiliza o diretório `/opt/sialm`.

```text
/opt/sialm/
├── backend/
│   ├── app/
│   ├── sialm.db
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── dist/
│   └── package.json
│
└── backup_sialm.sh
```

### Diretórios auxiliares

| Caminho | Finalidade |
|---------|------------|
| `/opt/sialm` | Aplicação principal. |
| `/etc/systemd/system/sialm.service` | Serviço Systemd. |
| `/var/backups/sialm` | Backups automáticos. |
| `/var/log` | Logs do sistema operacional. |

---

# 💾 2. Rotinas Preventivas

As rotinas abaixo devem ser executadas periodicamente para garantir integridade dos dados.

<table>
<tr>
<th>Rotina</th>
<th>Frequência</th>
</tr>

<tr>
<td>Backup SQLite</td>
<td>Diariamente</td>
</tr>

<tr>
<td>Atualização do repositório Git</td>
<td>Sempre que houver nova versão</td>
</tr>

<tr>
<td>Verificação do serviço</td>
<td>Diariamente</td>
</tr>

<tr>
<td>Revisão dos logs</td>
<td>Semanalmente</td>
</tr>

<tr>
<td>Limpeza de backups antigos</td>
<td>Automática (30 dias)</td>
</tr>

</table>

---

## 🔄 2.1 Backup Automático do Banco SQLite

O banco `sialm.db` deve ser copiado utilizando a API de backup do SQLite.

### Script de Backup

Crie o arquivo:

```bash
sudo nano /opt/sialm/backup_sialm.sh
```

Conteúdo:

```bash
#!/bin/bash

DATA=$(date +%Y%m%d_%H%M%S)

ORIGEM="/opt/sialm/backend/sialm.db"
DESTINO="/var/backups/sialm"

mkdir -p "$DESTINO"

sqlite3 "$ORIGEM" ".backup '$DESTINO/sialm_backup_$DATA.db'"

find "$DESTINO" \
-type f \
-name "sialm_backup_*.db" \
-mtime +30 \
-delete
```

### Tornar executável

```bash
chmod +x /opt/sialm/backup_sialm.sh
```

### Agendar no Cron

```bash
crontab -e
```

Executar diariamente às **22:00**:

```cron
0 22 * * * /opt/sialm/backup_sialm.sh
```

### Restaurar um Backup

```bash
systemctl stop sialm

cp /var/backups/sialm/sialm_backup_20260925_220000.db \
/opt/sialm/backend/sialm.db

systemctl start sialm
```

> Sempre interrompa o serviço antes de substituir o banco.

---

# 🚀 3. Atualização do Sistema (Deploy)

Fluxo recomendado para atualização do servidor.

## Passo 1. Parar o serviço

```bash
sudo systemctl stop sialm
```

## Passo 2. Atualizar o código

```bash
cd /opt/sialm

git pull origin main
```

## Passo 3. Atualizar o Frontend

```bash
cd frontend

npm install
npm run build
```

## Passo 4. Atualizar dependências Python

```bash
cd ../backend

source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
```

## Passo 5. Ajustar permissões

```bash
sudo chown -R sialm:www-data /opt/sialm

sudo chmod -R 755 /opt/sialm/frontend/dist
```

## Passo 6. Reiniciar

```bash
sudo systemctl daemon-reload
sudo systemctl restart sialm
sudo systemctl status sialm
```

---

# ⚙️ 4. Gerenciamento do Serviço (Systemd)

O backend é executado como serviço Linux.

Arquivo:

```text
/etc/systemd/system/sialm.service
```

## Comandos principais

<table>
<tr>
<th>Ação</th>
<th>Comando</th>
</tr>

<tr>
<td>Iniciar</td>
<td>

```bash
sudo systemctl start sialm
```

</td>
</tr>

<tr>
<td>Parar</td>
<td>

```bash
sudo systemctl stop sialm
```

</td>
</tr>

<tr>
<td>Reiniciar</td>
<td>

```bash
sudo systemctl restart sialm
```

</td>
</tr>

<tr>
<td>Status</td>
<td>

```bash
sudo systemctl status sialm
```

</td>
</tr>

<tr>
<td>Habilitar no boot</td>
<td>

```bash
sudo systemctl enable sialm
```

</td>
</tr>

<tr>
<td>Desabilitar</td>
<td>

```bash
sudo systemctl disable sialm
```

</td>
</tr>

</table>

---

# 📋 5. Monitoramento e Logs

## Logs em tempo real

```bash
sudo journalctl -u sialm -f
```

## Últimos eventos

```bash
sudo journalctl -u sialm -n 100
```

## Logs desde o boot

```bash
sudo journalctl -u sialm -b
```

## Verificar porta do serviço

```bash
sudo ss -tulpn | grep 8001
```

Saída esperada:

```text
LISTEN 0 2048 0.0.0.0:8001
```

---

# 🚨 6. Resolução de Problemas (Troubleshooting)

## Erro 1. Porta 8001 ocupada (`Errno 98`)

### Sintomas

- Serviço entra em loop de reinicialização.
- Uvicorn informa:

```text
Address already in use
```

### Diagnóstico

```bash
sudo ss -tulpn | grep 8001
```

### Correção

```bash
sudo systemctl stop sialm

sudo fuser -k 8001/tcp

sudo pkill -9 -f uvicorn

sudo systemctl start sialm
```

---

## Erro 2. `status=203/EXEC`

### Causa

O ambiente virtual foi removido, movido ou corrompido.

### Correção

```bash
cd /opt/sialm/backend

rm -rf venv

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

sudo systemctl restart sialm
```

---

## Erro 3. Página inicial retorna `{"detail":"Not Found"}`

### Causa

Frontend React não compilado.

### Diagnóstico

```bash
ls /opt/sialm/frontend/dist/index.html
```

### Correção

```bash
cd /opt/sialm/frontend

npm install

npm run build

sudo systemctl restart sialm
```

---

## Erro 4. `PermissionError: [Errno 13]`

### Causa

Permissões incorretas do banco SQLite.

### Correção

```bash
sudo chown -R sialm:www-data /opt/sialm/backend

sudo chmod 775 /opt/sialm/backend

sudo chmod 664 /opt/sialm/backend/sialm.db

rm -f /opt/sialm/backend/sialm.db-wal
rm -f /opt/sialm/backend/sialm.db-journal

sudo systemctl restart sialm
```

---

## Erro 5. Banco bloqueado (`database is locked`)

### Diagnóstico

```bash
lsof /opt/sialm/backend/sialm.db
```

### Correção

```bash
sudo systemctl stop sialm

rm -f /opt/sialm/backend/sialm.db-wal
rm -f /opt/sialm/backend/sialm.db-shm

sudo systemctl start sialm
```

---

## Erro 6. Dependências Python quebradas

### Atualizar ambiente

```bash
source /opt/sialm/backend/venv/bin/activate

pip install --upgrade pip

pip install -r /opt/sialm/backend/requirements.txt
```

---

# 🔐 7. Recuperação de Emergência

## Redefinir senha do Administrador

```bash
cd /opt/sialm/backend

source venv/bin/activate
```

Execute:

```bash
python3 -c "
import sqlite3,bcrypt

conn=sqlite3.connect('sialm.db')
cur=conn.cursor()

senha=bcrypt.hashpw(
    'admin123'.encode(),
    bcrypt.gensalt()
).decode()

cur.execute(
'UPDATE usuarios SET senha_hash=?, perfil=\"admin\" WHERE email=\"admin@sialm.local\"',
(senha,)
)

conn.commit()
conn.close()

print('Senha redefinida com sucesso.')
"
```

Credenciais restauradas:

| Usuário | Senha |
|---------|--------|
| `admin@sialm.local` | `admin123` |

> Altere a senha imediatamente após recuperar o acesso.

---

# 🩺 Diagnóstico Rápido

<table>
<tr>
<th>Verificação</th>
<th>Comando</th>
</tr>

<tr>
<td>Serviço ativo</td>
<td>

```bash
systemctl status sialm
```

</td>
</tr>

<tr>
<td>Logs ao vivo</td>
<td>

```bash
journalctl -u sialm -f
```

</td>
</tr>

<tr>
<td>Porta 8001</td>
<td>

```bash
ss -tulpn | grep 8001
```

</td>
</tr>

<tr>
<td>Espaço em disco</td>
<td>

```bash
df -h
```

</td>
</tr>

<tr>
<td>Uso de memória</td>
<td>

```bash
free -h
```

</td>
</tr>

<tr>
<td>Uso de CPU</td>
<td>

```bash
top
```

</td>
</tr>

</table>

---

# 📦 Checklist Pós-Deploy

Após cada atualização, confirme:

- [ ] Serviço `sialm` iniciado.
- [ ] Frontend compilado (`frontend/dist`).
- [ ] API acessível em `/api/status`.
- [ ] Swagger disponível em `/docs`.
- [ ] Banco `sialm.db` com permissão correta.
- [ ] Backup automático configurado.
- [ ] Logs sem erros críticos.

---

# 📚 Documentação Relacionada

| Documento | Conteúdo |
|-----------|----------|
| `README.md` | Instalação, arquitetura e visão geral do projeto. |
| `TUTORIAL.md` | Guia operacional para usuários do sistema. |

---

## 👨‍💻 Ambiente Homologado

<table>
<tr><td><strong>Sistema Operacional</strong></td><td>Ubuntu Server 24.04 LTS+</td></tr>
<tr><td><strong>Python</strong></td><td>3.10 ou superior</td></tr>
<tr><td><strong>Node.js</strong></td><td>20 LTS ou superior</td></tr>
<tr><td><strong>Banco de Dados</strong></td><td>SQLite 3</td></tr>
<tr><td><strong>Servidor HTTP</strong></td><td>FastAPI + Uvicorn</td></tr>
<tr><td><strong>Gerenciador de Serviço</strong></td><td>Systemd</td></tr>
</table>

> Este guia cobre a infraestrutura padrão utilizada pelo SIALM em servidores Linux da Prefeitura Municipal de Lagoa do Piauí, podendo ser adaptado para outras distribuições compatíveis com Systemd.
