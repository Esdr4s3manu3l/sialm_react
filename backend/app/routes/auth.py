import bcrypt
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Usuario
from app.schemas import LoginRequest

router = APIRouter()

@router.post("/login")
def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    u = db.query(Usuario).filter(Usuario.email == req.email.strip().lower()).first()
    if not u or not bcrypt.checkpw(req.senha.encode(), u.senha_hash.encode()):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos.")

    user_info = {
        "id": u.id,
        "nome": u.nome,
        "email": u.email,
        "perfil": u.perfil
    }
    return {"status": "ok", "user": user_info}

@router.get("/me")
def me():
    return {"status": "ok"}