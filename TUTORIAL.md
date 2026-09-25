# 📘 Manual Operacional do SIALM

Guia oficial de utilização do **SIALM (Sistema Integrado de Almoxarifado Municipal)**.

Este documento apresenta o fluxo completo de utilização do sistema, desde a configuração inicial até a operação diária do estoque e emissão de relatórios.

---

## 📑 Índice

- [Níveis de Acesso](#-1-níveis-de-acesso-e-permissões)
- [Configuração Inicial](#-2-configuração-inicial-do-sistema)
- [Cadastro de Fornecedores](#-21-cadastro-de-fornecedores)
- [Cadastro de Setores](#-22-cadastro-de-setores-e-secretarias)
- [Cadastro de Produtos](#-23-cadastro-de-produtos)
- [Movimentações de Estoque](#-3-movimentações-de-estoque)
- [Relatórios](#-4-relatórios-e-auditoria)
- [Gestão de Usuários](#-5-gestão-de-usuários)

---

# 🔐 1. Níveis de Acesso e Permissões

O SIALM possui controle de acesso baseado em perfis (**RBAC**), garantindo que cada usuário visualize apenas as funcionalidades autorizadas.

| Perfil | Permissões |
|--------|------------|
| 👑 **Administrador** (`admin`) | Controle total do sistema, cadastro de usuários, fornecedores, produtos, inventário e relatórios. |
| 📦 **Operador** (`operador`) | Registro de entradas e saídas, consulta de estoque e movimentações diárias. |
| 📊 **Auditor** (`auditor`) | Consulta de movimentações, histórico, rastreabilidade e geração de relatórios. |

> Apenas administradores podem criar, editar ou redefinir usuários.

---

# ⚙️ 2. Configuração Inicial do Sistema

Antes de registrar qualquer movimentação, é necessário cadastrar as estruturas básicas do almoxarifado.

## Fluxo recomendado

```text
Fornecedores
      │
      ▼
Setores / Secretarias
      │
      ▼
Produtos / Materiais
      │
      ▼
Entrada de Estoque
      │
      ▼
Saída para Setores
```

A sequência acima garante que todas as movimentações estejam vinculadas corretamente.

---

## 🏢 2.1 Cadastro de Fornecedores

O fornecedor representa a empresa ou pessoa responsável pelo fornecimento dos materiais.

### Como cadastrar

1. Abra **Fornecedores** no menu lateral.
2. Clique em **Novo Fornecedor**.
3. Preencha os campos obrigatórios.
4. Salve o cadastro.

### Campos recomendados

| Campo | Obrigatório |
|-------|-------------|
| Razão Social | ✅ |
| CNPJ | ✅ |
| Telefone | Opcional |
| E-mail | Opcional |
| Contato | Opcional |

> O CNPJ deve ser único no sistema.

---

## 🏛️ 2.2 Cadastro de Setores e Secretarias

Os setores representam os locais que solicitam materiais ao almoxarifado.

### Exemplos

- Secretaria Municipal de Saúde
- Secretaria Municipal de Educação
- Secretaria de Administração
- Almoxarifado Central
- UBS Centro

### Como cadastrar

1. Menu **Setores**.
2. Clique em **Novo Setor**.
3. Informe:
   - Nome do setor;
   - Secretaria responsável;
   - Servidor responsável pela retirada.

---

## 📦 2.3 Cadastro de Produtos

Todo item armazenado deve possuir um cadastro.

### Informações do produto

| Campo | Exemplo |
|-------|---------|
| Nome | Papel A4 75g |
| Categoria | Material de Expediente |
| Unidade | Resma |
| Estoque Mínimo | 20 |
| Observação | Opcional |

### Estoque mínimo

O estoque mínimo é utilizado para identificar produtos próximos da reposição.

> Exemplo: Papel A4 com estoque mínimo igual a **20 resmas**.

---

# 🔄 3. Movimentações de Estoque

As movimentações registram todas as entradas e saídas de materiais.

---

## 📥 3.1 Registrar Entrada

Utilizado quando o município recebe materiais.

### Passo a passo

1. Menu **Movimentações → Entrada**.
2. Selecione o fornecedor.
3. Informe o número da Nota Fiscal.
4. Adicione os produtos.
5. Informe as quantidades recebidas.
6. Confirme a operação.

### Resultado

- Estoque atualizado automaticamente.
- Histórico de entrada registrado.
- NF vinculada à movimentação.

---

## 📤 3.2 Registrar Saída

Utilizado para atender solicitações dos setores municipais.

### Passo a passo

1. Menu **Movimentações → Saída**.
2. Escolha o setor solicitante.
3. Informe o responsável pela retirada.
4. Selecione os produtos.
5. Informe a quantidade.
6. Confirme a saída.

### Validações automáticas

- Não permite saída acima do estoque disponível.
- Registra responsável e data da retirada.
- Mantém histórico permanente.

---

## 🔍 3.3 Consulta de Estoque

A tela de estoque permite visualizar:

- Quantidade disponível.
- Categoria.
- Unidade de medida.
- Estoque mínimo.
- Última movimentação.

### Situações possíveis

| Situação | Significado |
|----------|-------------|
| 🟢 Disponível | Estoque suficiente. |
| 🟡 Atenção | Próximo do estoque mínimo. |
| 🔴 Crítico | Estoque abaixo do mínimo. |

---

# 📊 4. Relatórios e Auditoria

O módulo de relatórios permite acompanhar toda a movimentação do almoxarifado.

## Tipos de relatório

- Entradas por período.
- Saídas por setor.
- Produtos mais movimentados.
- Saldo de estoque.
- Histórico completo de movimentações.

## Filtros disponíveis

- Intervalo de datas.
- Secretaria.
- Setor.
- Categoria.
- Produto específico.

### Exportação

O sistema permite gerar relatórios em:

| Formato | Uso |
|---------|-----|
| 📄 PDF | Impressão e arquivo físico. |
| 📊 XLSX | Planilhas e consolidação de dados. |

---

# 👥 5. Gestão de Usuários

Funcionalidade exclusiva do perfil **Administrador**.

## Criar usuário

1. Menu **Usuários**.
2. Clique em **Novo Usuário**.
3. Informe nome, e-mail e perfil.
4. Defina uma senha inicial.

## Redefinir senha

1. Localize o usuário.
2. Clique em **Editar**.
3. Informe a nova senha.
4. Salve as alterações.

---

# 📝 Boas Práticas de Utilização

### Cadastro

- Não duplicar fornecedores.
- Utilizar descrições padronizadas para produtos.
- Definir corretamente a unidade de medida.

### Entradas

- Registrar sempre a Nota Fiscal.
- Conferir quantidades antes da confirmação.

### Saídas

- Confirmar o setor solicitante.
- Registrar o servidor responsável pela retirada.
- Nunca realizar saídas superiores ao estoque físico.

### Auditoria

- Emitir relatórios periodicamente.
- Conferir produtos abaixo do estoque mínimo.
- Manter o histórico preservado para prestação de contas.

---

# 📌 Fluxo Operacional Resumido

```text
Cadastro de Fornecedor
        │
        ▼
Cadastro de Setor
        │
        ▼
Cadastro de Produto
        │
        ▼
Entrada de Estoque (Nota Fiscal)
        │
        ▼
Estoque Atualizado
        │
        ▼
Saída para Secretaria/Setor
        │
        ▼
Relatórios e Auditoria
```

---

## 📖 Documentação Complementar

| Documento | Finalidade |
|-----------|------------|
| `README.md` | Instalação, arquitetura e execução do projeto. |
| `MANUTENCAO.md` | Backup, deploy, atualização e resolução de problemas. |

> Este manual destina-se aos operadores e administradores responsáveis pela utilização do SIALM na Prefeitura Municipal de Lagoa do Piauí.
