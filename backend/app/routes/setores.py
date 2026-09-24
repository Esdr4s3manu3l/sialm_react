from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Setor
from app.schemas import SetorCreate

router = APIRouter()

@router.get("")
def listar(db: Session = Depends(get_db)):
    return db.query(Setor).order_by(Setor.nome).all()

@router.post("")
def criar(setor: SetorCreate, db: Session = Depends(get_db)):
    novo = Setor(**setor.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.delete("/{id}")
def excluir(id: int, db: Session = Depends(get_db)):
    setor = db.query(Setor).filter(Setor.id == id).first()
    if not setor:
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    db.delete(setor)
    db.commit()
    return {"status": "sucesso"}