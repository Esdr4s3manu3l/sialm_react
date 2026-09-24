import io
import pandas as pd
from datetime import datetime
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Produto, Movimentacao, Setor, TipoMovimentacao

router = APIRouter()

@router.get("/metricas-dashboard")
def dashboard_metrics(db: Session = Depends(get_db)):
    agora = datetime.now()
    total_produtos = db.query(Produto).count()
    zerados = db.query(Produto).filter(Produto.quantidade_estoque <= 0).count()
    alerta = db.query(Produto).filter(Produto.quantidade_estoque <= Produto.estoque_minimo).count()
    total_setores = db.query(Setor).count()

    movs = db.query(Movimentacao).all()
    entradas_mes = sum(m.quantidade for m in movs if m.tipo == TipoMovimentacao.ENTRADA and m.data_movimentacao.month == agora.month and m.data_movimentacao.year == agora.year)
    saidas_mes = sum(m.quantidade for m in movs if m.tipo == TipoMovimentacao.SAIDA and m.data_movimentacao.month == agora.month and m.data_movimentacao.year == agora.year)

    return {
        "total_produtos": total_produtos,
        "itens_zerados": zerados,
        "estoque_baixo": alerta,
        "total_setores": total_setores,
        "entradas_mes": entradas_mes,
        "saidas_mes": saidas_mes
    }

@router.get("/exportar-excel")
def exportar_excel(db: Session = Depends(get_db)):
    produtos = db.query(Produto).order_by(Produto.nome).all()
    dados = [{
        "Código": p.id,
        "Produto": p.nome,
        "Categoria": p.categoria,
        "Unidade": p.unidade,
        "Saldo": p.quantidade_estoque,
        "Mínimo": p.estoque_minimo
    } for p in produtos]
    df = pd.DataFrame(dados)
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Estoque")
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition": "attachment; filename=estoque_sialm.xlsx"})