from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Produto
from app.schemas import ProdutoCreate

router = APIRouter()

@router.get("")
def listar(db: Session = Depends(get_db)):
    return db.query(Produto).order_by(Produto.nome).all()

@router.post("")
def criar(prod: ProdutoCreate, db: Session = Depends(get_db)):
    novo = Produto(**prod.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.put("/{id}")
def atualizar(id: int, dados: ProdutoCreate, db: Session = Depends(get_db)):
    prod = db.query(Produto).filter(Produto.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for campo, valor in dados.model_dump().items():
        setattr(prod, campo, valor)
    db.commit()
    return prod

@router.delete("/{id}")
def excluir(id: int, db: Session = Depends(get_db)):
    prod = db.query(Produto).filter(Produto.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(prod)
    db.commit()
    return {"status": "sucesso"}