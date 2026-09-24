import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Usuario
from app.schemas import AtualizarPerfilProprio, AlterarSenhaPropria

router = APIRouter()

@router.get("/{usuario_id}")
def obter_perfil(usuario_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Utilizador não localizado.")
    
    criado_str = usuario.criado_em.strftime("%d/%m/%Y às %H:%M") if usuario.criado_em else "-"
    return {
        "id": usuario.id,
        "nome": usuario.nome,
        "email": usuario.email,
        "perfil": usuario.perfil,
        "criado_em": criado_str
    }

@router.put("/atualizar-dados")
def atualizar_dados(req: AtualizarPerfilProprio, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == req.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Utilizador não localizado.")
    
    usuario.nome = req.nome.strip()
    db.commit()
    db.refresh(usuario)
    return {
        "status": "sucesso",
        "mensagem": "Dados atualizados com sucesso!",
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "perfil": usuario.perfil
        }
    }

@router.post("/alterar-senha")
def alterar_senha_propria(req: AlterarSenhaPropria, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == req.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Utilizador não localizado.")

    # 1. Validação da palavra-passe atual
    senha_atual_bytes = req.senha_atual.encode("utf-8")
    hash_bytes = usuario.senha_hash.encode("utf-8")
    if not bcrypt.checkpw(senha_atual_bytes, hash_bytes):
        raise HTTPException(status_code=400, detail="A palavra-passe atual informada está incorreta.")

    # 2. Validação da nova palavra-passe
    if len(req.nova_senha) < 6:
        raise HTTPException(status_code=400, detail="A nova palavra-passe deve conter pelo menos 6 caracteres.")

    # 3. Criptografia e gravação
    novo_hash = bcrypt.hashpw(req.nova_senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    usuario.senha_hash = novo_hash
    db.commit()

    return {"status": "sucesso", "mensagem": "Palavra-passe alterada com sucesso!"}