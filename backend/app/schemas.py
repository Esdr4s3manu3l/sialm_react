from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    senha: str

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