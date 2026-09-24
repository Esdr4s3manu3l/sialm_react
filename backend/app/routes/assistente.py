from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Produto, Movimentacao, Setor, TipoMovimentacao
from app.schemas import PerguntaAssistente

router = APIRouter()


@router.post("/chat")
def processar_pergunta(req: PerguntaAssistente, db: Session = Depends(get_db)):
    texto = req.mensagem.strip().lower()
    agora = datetime.now()

    # 1. PANORAMA GERAL
    if any(p in texto for p in ["panorama", "resumo", "geral", "status", "dashboard"]):
        total_prods = db.query(Produto).count()
        zerados = db.query(Produto).filter(Produto.quantidade_estoque <= 0).count()
        baixo = db.query(Produto).filter(Produto.quantidade_estoque <= Produto.estoque_minimo).count()
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
            "resposta": (
                f"📊 **Panorama Operacional do Almoxarifado Central**:\n\n"
                f"• **Artigos cadastrados:** {total_prods} produtos\n"
                f"• **Artigos com estoque zerado:** {zerados}\n"
                f"• **Artigos em margem de alerta (mínimo):** {baixo}\n"
                f"• **Setores/Unidades atendidas:** {total_setores}\n"
                f"• **Movimentação do mês ({agora.month:02d}/{agora.year}):** +{entradas_mes} entradas e -{saidas_mes} saídas."
            )
        }

    # 2. ESTOQUE BAIXO / REPOSIÇÃO
    if any(p in texto for p in ["baixo", "critico", "crítico", "repor", "comprar", "minimo", "mínimo"]):
        produtos_baixos = db.query(Produto).filter(Produto.quantidade_estoque <= Produto.estoque_minimo).all()
        if not produtos_baixos:
            return {"resposta": "✅ Todos os produtos possuem estoque acima da margem mínima de segurança no momento."}

        itens_formatados = "\n".join(
            [f"• **{p.nome}**: Saldo atual {p.quantidade_estoque} {p.unidade} (Mínimo: {p.estoque_minimo})" for p in produtos_baixos[:10]]
        )
        total_criticos = len(produtos_baixos)
        mais_msg = f"\n*(Exibindo 10 de {total_criticos} itens em alerta)*" if total_criticos > 10 else ""

        return {
            "resposta": f"⚠️ **Atenção! Existem {total_criticos} produto(s) com necessidade de reposição:**\n\n{itens_formatados}{mais_msg}"
        }

    # 3. ITENS ZERADOS
    if any(p in texto for p in ["zerado", "zerados", "acabou", "falta", "sem estoque"]):
        zerados = db.query(Produto).filter(Produto.quantidade_estoque <= 0).all()
        if not zerados:
            return {"resposta": "✅ Não existem materiais com saldo zerado no almoxarifado."}

        lista = "\n".join([f"• **{p.nome}** (Cat.: {p.categoria or 'Geral'})" for p in zerados[:10]])
        return {
            "resposta": f"🚫 **Materiais com estoque totalmente zerado ({len(zerados)} encontrado(s)):**\n\n{lista}"
        }

    # 4. ÚLTIMAS MOVIMENTAÇÕES
    if any(p in texto for p in ["saida", "saída", "saidas", "saídas", "ultimas", "últimas", "movimento"]):
        ultimas = db.query(Movimentacao).order_by(Movimentacao.data_movimentacao.desc()).limit(5).all()
        if not ultimas:
            return {"resposta": "ℹ️ Nenhuma movimentação recente registrada no almoxarifado."}

        detalhes = "\n".join(
            [f"• {m.data_movimentacao.strftime('%d/%m %H:%M')} [{m.tipo.value.upper()}]: **{m.quantidade}x** {m.produto.nome if m.produto else 'Material'} ➔ {m.setor.nome if m.setor else 'Almoxarifado'}" for m in ultimas]
        )
        return {
            "resposta": f"📦 **Últimas 5 operações registradas no sistema:**\n\n{detalhes}"
        }

    # 5. CONSULTA PONTUAL DE PRODUTO POR NOME
    termos = [w for w in texto.replace("?", "").replace("quanto", "").replace("tem", "").replace("de", "").split() if len(w) > 2]
    for termo in termos:
        prod = db.query(Produto).filter(Produto.nome.ilike(f"%{termo}%")).first()
        if prod:
            situacao = "⚠️ Crítico" if prod.quantidade_estoque <= prod.estoque_minimo else "✅ Regular"
            return {
                "resposta": (
                    f"🔍 **Consulta de Material**: **{prod.nome}**\n\n"
                    f"• **Saldo em Estoque:** {prod.quantidade_estoque} {prod.unidade}\n"
                    f"• **Estoque Mínimo:** {prod.estoque_minimo} {prod.unidade}\n"
                    f"• **Categoria:** {prod.categoria or 'Geral'}\n"
                    f"• **Situação:** {situacao}"
                )
            }

    # RESPOSTA GUIA
    return {
        "resposta": (
            "Olá! Sou a **Ana**, assistente do Almoxarifado Central de Lagoa do Piauí.\n\n"
            "Posso consultar dados reais para você agora mesmo. Experimente perguntar:\n"
            "• *\"Qual o panorama geral do estoque?\"*\n"
            "• *\"Quais produtos estão com estoque baixo?\"*\n"
            "• *\"Quais itens estão zerados?\"*\n"
            "• *\"Quais foram as últimas movimentações?\"*\n"
            "• Ou digite o nome de qualquer material para saber o saldo (ex: *\"Tem papel A4?\"*)."
        )
    }