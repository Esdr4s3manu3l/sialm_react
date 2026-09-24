import bcrypt
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Usuario
from app.schemas import LoginRequest, UsuarioCadastro

router = APIRouter()


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    email_limpo = req.email.strip().lower()
    usuario = db.query(Usuario).filter(Usuario.email == email_limpo).first()

    if not usuario:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    senha_bytes = req.senha.encode("utf-8")
    hash_bytes = usuario.senha_hash.encode("utf-8")

    if not bcrypt.checkpw(senha_bytes, hash_bytes):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    return {
        "status": "sucesso",
        "user": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "perfil": usuario.perfil
        }
    }


@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(req: UsuarioCadastro, db: Session = Depends(get_db)):
    email_limpo = req.email.strip().lower()

    if db.query(Usuario).filter(Usuario.email == email_limpo).first():
        raise HTTPException(status_code=400, detail="Este e-mail já está cadastrado.")

    if len(req.senha) < 6:
        raise HTTPException(status_code=400, detail="A senha deve conter no mínimo 6 caracteres.")

    senha_hash = bcrypt.hashpw(req.senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    perfil_valido = req.perfil if req.perfil in ["admin", "operador", "auditor"] else "operador"

    novo_usuario = Usuario(
        nome=req.nome.strip(),
        email=email_limpo,
        senha_hash=senha_hash,
        perfil=perfil_valido,
        criado_em=datetime.now()
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "status": "sucesso",
        "mensagem": "Usuário cadastrado com sucesso!",
        "user": {
            "id": novo_usuario.id,
            "nome": novo_usuario.nome,
            "email": novo_usuario.email,
            "perfil": novo_usuario.perfil
        }
    }