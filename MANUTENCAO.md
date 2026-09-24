---

### MANUTENCAO.md

```markdown
# Guia de Manutenção, Diagnóstico e Resolução de Problemas

Manual de suporte técnico e sustentação da infraestrutura do SIALM.

---

## 1. Rotinas Preventivas Obrigatórias

### A. Backup Diário Automatizado do Banco SQLite
Como o banco reside no arquivo `sialm.db`, backups consistentes devem ser executados através da API de backup do SQLite (evitando copiar arquivos com escritas ativas).

Crie o script em `/opt/sialm/backup_sialm.sh`:
```bash
#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
ORIGEM="/opt/sialm/backend/sialm.db"
DESTINO="/var/backups/sialm"

mkdir -p $DESTINO
sqlite3 "$ORIGEM" ".backup '$DESTINO/sialm_backup_$DATA.db'"
# Mantém apenas os últimos 30 backups
find $DESTINO -type f -name "sialm_backup_*.db" -mtime +30 -delete
