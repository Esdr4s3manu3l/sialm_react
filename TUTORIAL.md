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
