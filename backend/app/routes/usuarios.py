import bcrypt
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Usuario

router = APIRouter()


class AtualizarPerfilRequest(BaseModel):
    perfil: str  # admin, operador, auditor


class RedefinirSenhaRequest(BaseModel):
    nova_senha: str


@router.get("")
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(Usuario).order_by(Usuario.id.asc()).all()
    resultado = []
    for u in usuarios:
        criado_str = ""
        if u.criado_em:
            criado_str = u.criado_em.strftime("%d/%m/%Y %H:%M") if hasattr(u.criado_em, "strftime") else str(u.criado_em)[:16]

        resultado.append({
            "id": u.id,
            "nome": u.nome,
            "email": u.email,
            "perfil": u.perfil or "operador",
            "criado_em": criado_str or "-"
        })
    return resultado


@router.patch("/{usuario_id}/perfil")
def alterar_perfil(usuario_id: int, req: AtualizarPerfilRequest, db: Session = Depends(get_db)):
    if req.perfil not in ["admin", "operador", "auditor"]:
        raise HTTPException(status_code=400, detail="Perfil inválido. Escolha entre admin, operador ou auditor.")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    usuario.perfil = req.perfil
    db.commit()
    db.refresh(usuario)
    return {"status": "sucesso", "mensagem": f"Perfil do usuário {usuario.nome} atualizado para {usuario.perfil}."}


@router.patch("/{usuario_id}/senha")
def redefinir_senha(usuario_id: int, req: RedefinirSenhaRequest, db: Session = Depends(get_db)):
    if len(req.nova_senha) < 6:
        raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 6 dígitos.")

    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    senha_hash = bcrypt.hashpw(req.nova_senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    usuario.senha_hash = senha_hash
    db.commit()
    return {"status": "sucesso", "mensagem": f"Senha de {usuario.nome} redefinida com sucesso."}


@router.delete("/{usuario_id}")
def excluir_usuario(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Proteção para manter ao menos o administrador original
    if usuario.email == "admin@sialm.local":
        raise HTTPException(status_code=400, detail="Não é permitido excluir o Administrador Geral raiz do sistema.")

    db.delete(usuario)
    db.commit()
    return {"status": "sucesso", "mensagem": f"Usuário {usuario.nome} removido do sistema."}