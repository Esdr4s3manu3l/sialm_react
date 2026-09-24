from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Fornecedor
from app.schemas import FornecedorCreate

router = APIRouter()

@router.get("")
def listar_fornecedores(db: Session = Depends(get_db)):
    return db.query(Fornecedor).order_by(Fornecedor.razao_social.asc()).all()

@router.post("", status_code=status.HTTP_201_CREATED)
def criar_fornecedor(req: FornecedorCreate, db: Session = Depends(get_db)):
    cnpj_limpo = req.cnpj.strip()
    if db.query(Fornecedor).filter(Fornecedor.cnpj == cnpj_limpo).first():
        raise HTTPException(status_code=400, detail="Já existe um fornecedor registado com este CNPJ.")

    novo = Fornecedor(
        razao_social=req.razao_social.strip(),
        nome_fantasia=req.nome_fantasia.strip() if req.nome_fantasia else None,
        cnpj=cnpj_limpo,
        telefone=req.telefone.strip() if req.telefone else None,
        email=req.email.strip().lower() if req.email else None,
        endereco=req.endereco.strip() if req.endereco else None,
        criado_em=datetime.now()
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

@router.delete("/{fornecedor_id}")
def remover_fornecedor(fornecedor_id: int, db: Session = Depends(get_db)):
    forn = db.query(Fornecedor).filter(Fornecedor.id == fornecedor_id).first()
    if not forn:
        raise HTTPException(status_code=404, detail="Fornecedor não encontrado.")

    db.delete(forn)
    db.commit()
    return {"status": "sucesso", "mensagem": "Fornecedor removido com sucesso."}