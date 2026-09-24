import io
from datetime import datetime
from typing import Optional
import pandas as pd
from fastapi import APIRouter, Depends, Query
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
    entradas_mes = sum(
        m.quantidade for m in movs 
        if m.tipo == TipoMovimentacao.ENTRADA 
        and m.data_movimentacao and m.data_movimentacao.month == agora.month and m.data_movimentacao.year == agora.year
    )
    saidas_mes = sum(
        m.quantidade for m in movs 
        if m.tipo == TipoMovimentacao.SAIDA 
        and m.data_movimentacao and m.data_movimentacao.month == agora.month and m.data_movimentacao.year == agora.year
    )

    return {
        "total_produtos": total_produtos,
        "itens_zerados": zerados,
        "estoque_baixo": alerta,
        "total_setores": total_setores,
        "entradas_mes": entradas_mes,
        "saidas_mes": saidas_mes
    }


@router.get("/exportar-excel")
def exportar_movimentacoes_excel(
    tipo: Optional[str] = Query(None),
    setor_id: Optional[int] = Query(None),
    produto_id: Optional[int] = Query(None),
    mes: Optional[int] = Query(None),
    ano: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Movimentacao).order_by(Movimentacao.data_movimentacao.desc())

    if tipo and tipo in ["entrada", "saida"]:
        query = query.filter(Movimentacao.tipo == tipo)
    if setor_id:
        query = query.filter(Movimentacao.setor_id == setor_id)
    if produto_id:
        query = query.filter(Movimentacao.produto_id == produto_id)

    movs = query.all()

    dados = []
    for m in movs:
        if not m.data_movimentacao:
            continue
        if mes and mes > 0 and m.data_movimentacao.month != mes:
            continue
        if ano and ano > 0 and m.data_movimentacao.year != ano:
            continue

        tipo_nome = "ENTRADA" if m.tipo == TipoMovimentacao.ENTRADA else "SAÍDA"
        destino_origem = m.setor.nome if m.setor else ("Fornecedor / Almoxarifado Central" if m.tipo == TipoMovimentacao.ENTRADA else "Geral")

        dados.append({
            "Código": m.id,
            "Data/Hora": m.data_movimentacao.strftime("%d/%m/%Y %H:%M"),
            "Operação": tipo_nome,
            "Material": m.produto.nome if m.produto else "Material",
            "Categoria": getattr(m.produto, "categoria", "Geral") if m.produto else "Geral",
            "Quantidade": m.quantidade,
            "Unidade": m.produto.unidade if m.produto else "UN",
            "Setor / Origem": destino_origem,
            "Nota Fiscal / Protocolo": m.nfe or "-",
            "Observações / Responsável": m.observacao or "-"
        })

    if not dados:
        dados.append({"Aviso": "Nenhum registro encontrado para os filtros selecionados."})

    df = pd.DataFrame(dados)
    buf = io.BytesIO()
    with pd.ExcelWriter(buf, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Movimentacoes")
    buf.seek(0)

    nome_arquivo = f"relatorio_sialm_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={nome_arquivo}"}
    )