import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.database.connection import Base


class PerfilUsuario(str, enum.Enum):
    ADMIN = "admin"
    OPERADOR = "operador"
    AUDITOR = "auditor"


class TipoMovimentacao(str, enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    senha_hash = Column(String(255), nullable=False)
    perfil = Column(String(20), default="operador")
    criado_em = Column(DateTime, default=datetime.now, nullable=False)


class Setor(Base):
    __tablename__ = "setores"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    secretaria = Column(String(100), nullable=True)
    responsavel = Column(String(100), nullable=True)

    movimentacoes = relationship("Movimentacao", back_populates="setor")


class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False, index=True)
    categoria = Column(String(80), default="Geral")
    unidade = Column(String(20), default="UN")
    quantidade_estoque = Column(Integer, default=0)
    estoque_minimo = Column(Integer, default=5)
    descricao = Column(String(255), nullable=True)

    movimentacoes = relationship("Movimentacao", back_populates="produto")


class Movimentacao(Base):
    __tablename__ = "movimentacoes"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(SQLEnum(TipoMovimentacao), nullable=False)
    quantidade = Column(Integer, nullable=False)
    data_movimentacao = Column(DateTime, default=datetime.now, nullable=False)
    nfe = Column(String(100), nullable=True)
    observacao = Column(String(255), nullable=True)

    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=False)
    setor_id = Column(Integer, ForeignKey("setores.id"), nullable=True)

    produto = relationship("Produto", back_populates="movimentacoes")
    setor = relationship("Setor", back_populates="movimentacoes")

class Fornecedor(Base):
    __tablename__ = "fornecedores"

    id = Column(Integer, primary_key=True, index=True)
    razao_social = Column(String(150), nullable=False)
    nome_fantasia = Column(String(150), nullable=True)
    cnpj = Column(String(20), unique=True, nullable=False, index=True)
    telefone = Column(String(30), nullable=True)
    email = Column(String(100), nullable=True)
    endereco = Column(String(200), nullable=True)
    criado_em = Column(DateTime, default=datetime.now, nullable=False)