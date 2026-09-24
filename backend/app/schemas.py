from pydantic import BaseModel
from typing import Optional, List


class LoginRequest(BaseModel):
    email: str
    senha: str


class UsuarioCadastro(BaseModel):
    nome: str
    email: str
    senha: str
    perfil: Optional[str] = "operador"


class PerguntaAssistente(BaseModel):
    mensagem: str


class SetorCreate(BaseModel):
    nome: str
    secretaria: Optional[str] = None
    responsavel: Optional[str] = None


class ProdutoCreate(BaseModel):
    nome: str
    categoria: Optional[str] = "Geral"
    unidade: str = "UN"
    quantidade_estoque: int = 0
    estoque_minimo: int = 5
    descricao: Optional[str] = None


class ItemMovimentacao(BaseModel):
    produto_id: int
    quantidade: int


class EntradaMultiplaRequest(BaseModel):
    itens: List[ItemMovimentacao]
    nfe: Optional[str] = None
    observacao: Optional[str] = None


class SaidaMultiplaRequest(BaseModel):
    itens: List[ItemMovimentacao]
    setor_id: int
    protocolo: Optional[str] = None
    servidor: Optional[str] = None

class AtualizarPerfilProprio(BaseModel):
    usuario_id: int
    nome: str

class AlterarSenhaPropria(BaseModel):
    usuario_id: int
    senha_atual: str
    nova_senha: str

class FornecedorCreate(BaseModel):
    razao_social: str
    nome_fantasia: Optional[str] = None
    cnpj: str
    telefone: Optional[str] = None
    email: Optional[str] = None
    endereco: Optional[str] = None