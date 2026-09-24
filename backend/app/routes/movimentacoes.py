from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Movimentacao, Produto, TipoMovimentacao
from app.schemas import EntradaMultiplaRequest, SaidaMultiplaRequest

router = APIRouter()

@router.get("")
def listar(db: Session = Depends(get_db)):
    movs = db.query(Movimentacao).order_by(Movimentacao.data_movimentacao.desc()).all()
    resultado = []
    for m in movs:
        resultado.append({
            "id": m.id,
            "tipo": m.tipo.value,
            "quantidade": m.quantidade,
            "data": m.data_movimentacao.strftime("%d/%m/%Y %H:%M"),
            "nfe": m.nfe,
            "observacao": m.observacao,
            "produto_id": m.produto_id,
            "produto_nome": m.produto.nome if m.produto else "Excluído",
            "unidade": m.produto.unidade if m.produto else "UN",
            "categoria": m.produto.categoria if m.produto else "Geral",
            "setor_id": m.setor_id,
            "setor_nome": m.setor.nome if m.setor else None
        })
    return resultado

@router.post("/entrada")
def registrar_entrada(req: EntradaMultiplaRequest, db: Session = Depends(get_db)):
    ids = []
    for item in req.itens:
        prod = db.query(Produto).filter(Produto.id == item.produto_id).first()
        if not prod:
            continue
        prod.quantidade_estoque += item.quantidade
        nova = Movimentacao(
            produto_id=prod.id,
            tipo=TipoMovimentacao.ENTRADA,
            quantidade=item.quantidade,
            nfe=req.nfe,
            observacao=req.observacao,
            data_movimentacao=datetime.now()
        )
        db.add(nova)
        db.flush()
        ids.append(nova.id)
    db.commit()
    return {"status": "sucesso", "ids": ids}

@router.post("/saida")
def registrar_saida(req: SaidaMultiplaRequest, db: Session = Depends(get_db)):
    # Validação de estoque
    for item in req.itens:
        prod = db.query(Produto).filter(Produto.id == item.produto_id).first()
        if not prod:
            raise HTTPException(status_code=404, detail=f"Produto #{item.produto_id} não encontrado")
        if item.quantidade > prod.quantidade_estoque:
            raise HTTPException(status_code=400, detail=f"Estoque insuficiente para {prod.nome}. Saldo: {prod.quantidade_estoque}")

    ids = []
    obs_parts = []
    if req.protocolo: obs_parts.append(f"Req: {req.protocolo}")
    if req.servidor: obs_parts.append(f"Resp: {req.servidor}")
    obs_final = " | ".join(obs_parts) if obs_parts else None

    for item in req.itens:
        prod = db.query(Produto).filter(Produto.id == item.produto_id).first()
        prod.quantidade_estoque -= item.quantidade
        nova = Movimentacao(
            produto_id=prod.id,
            setor_id=req.setor_id,
            tipo=TipoMovimentacao.SAIDA,
            quantidade=item.quantidade,
            nfe=req.protocolo,
            observacao=obs_final,
            data_movimentacao=datetime.now()
        )
        db.add(nova)
        db.flush()
        ids.append(nova.id)
    db.commit()
    return {"status": "sucesso", "ids": ids}

@router.delete("/{id}")
def estornar(id: int, db: Session = Depends(get_db)):
    mov = db.query(Movimentacao).filter(Movimentacao.id == id).first()
    if not mov:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")
    prod = mov.produto
    if prod:
        if mov.tipo == TipoMovimentacao.SAIDA:
            prod.quantidade_estoque += mov.quantidade
        else:
            prod.quantidade_estoque -= mov.quantidade
    db.delete(mov)
    db.commit()
    return {"status": "sucesso"}

@router.get("/recibo-dados")
def recibo_dados(ids: str, db: Session = Depends(get_db)):
    id_list = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
    movs = db.query(Movimentacao).filter(Movimentacao.id.in_(id_list)).all()
    if not movs:
        raise HTTPException(status_code=404, detail="Nenhum registro encontrado")

    primeira = movs[0]
    return {
        "setor": primeira.setor.nome if primeira.setor else "Não informado",
        "secretaria": primeira.setor.secretaria if (primeira.setor and primeira.setor.secretaria) else "Secretaria de Administração",
        "data": primeira.data_movimentacao.strftime("%d/%m/%Y às %H:%M"),
        "observacao": primeira.observacao,
        "protocolo": primeira.nfe,
        "itens": [
            {
                "id": m.id,
                "produto": m.produto.nome if m.produto else "Material",
                "quantidade": m.quantidade,
                "unidade": m.produto.unidade if m.produto else "UN"
            }
            for m in movs
        ]
    }