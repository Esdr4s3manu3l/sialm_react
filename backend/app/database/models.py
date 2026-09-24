import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .connection import Base

class PerfilUsuario(str, enum.Enum):
    ADMIN = "admin"
    AUDITOR = "auditor"

class TipoMovimentacao(str, enum.Enum):
    ENTRADA = "entrada"
    SAIDA = "saida"

class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    perfil = Column(String(20), default="admin", nullable=False)

class Setor(Base):
    __tablename__ = "setores"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    secretaria = Column(String(150), nullable=True)
    responsavel = Column(String(100), nullable=True)
    movimentacoes = relationship("Movimentacao", back_populates="setor")

class Produto(Base):
    __tablename__ = "produtos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False, index=True)
    categoria = Column(String(80), nullable=True, index=True)
    unidade = Column(String(20), default="UN", nullable=False)
    quantidade_estoque = Column(Integer, default=0, nullable=False)
    estoque_minimo = Column(Integer, default=5, nullable=False)
    descricao = Column(String(255), nullable=True)
    movimentacoes = relationship("Movimentacao", back_populates="produto", cascade="all, delete")

class Movimentacao(Base):
    __tablename__ = "movimentacoes"
    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id", ondelete="CASCADE"), nullable=False)
    setor_id = Column(Integer, ForeignKey("setores.id", ondelete="SET NULL"), nullable=True)
    tipo = Column(Enum(TipoMovimentacao), nullable=False)
    quantidade = Column(Integer, nullable=False)
    nfe = Column(String(50), nullable=True)
    observacao = Column(String(255), nullable=True)
    data_movimentacao = Column(DateTime, default=datetime.now, nullable=False)

    produto = relationship("Produto", back_populates="movimentacoes")
    setor = relationship("Setor", back_populates="movimentacoes")