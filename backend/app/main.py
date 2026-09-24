import sqlite3
import os
import bcrypt
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database.connection import engine, Base, get_db, DB_PATH
from app.database.models import Usuario
from app.routes import auth, produtos, setores, movimentacoes, relatorios


def migrar_colunas_legadas():
    """Garante a existência de colunas novas em bases de dados existentes."""
    if not os.path.exists(DB_PATH):
        return
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Ajuste na tabela setores
        cursor.execute("PRAGMA table_info(setores)")
        colunas_setores = [c[1] for c in cursor.fetchall()]
        if colunas_setores:
            if "secretaria" not in colunas_setores:
                cursor.execute("ALTER TABLE setores ADD COLUMN secretaria TEXT")
            if "responsavel" not in colunas_setores:
                cursor.execute("ALTER TABLE setores ADD COLUMN responsavel TEXT")

        # Ajuste na tabela produtos
        cursor.execute("PRAGMA table_info(produtos)")
        colunas_produtos = [c[1] for c in cursor.fetchall()]
        if colunas_produtos:
            if "categoria" not in colunas_produtos:
                cursor.execute("ALTER TABLE produtos ADD COLUMN categoria TEXT DEFAULT 'Geral'")
            if "estoque_minimo" not in colunas_produtos:
                cursor.execute("ALTER TABLE produtos ADD COLUMN estoque_minimo INTEGER DEFAULT 5")

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[!] Aviso na migração de colunas: {e}")


def seed_usuarios():
    Base.metadata.create_all(bind=engine)
    migrar_colunas_legadas()

    db: Session = next(get_db())
    try:
        def get_hash(senha: str):
            return bcrypt.hashpw(senha.encode(), bcrypt.gensalt()).decode()

        if not db.query(Usuario).filter(Usuario.email == "admin@sialm.local").first():
            db.add(Usuario(nome="Administrador Geral", email="admin@sialm.local", senha_hash=get_hash("admin123"), perfil="admin"))
        if not db.query(Usuario).filter(Usuario.email == "auditor@sialm.local").first():
            db.add(Usuario(nome="Auditoria Municipal", email="auditor@sialm.local", senha_hash=get_hash("auditor123"), perfil="auditor"))
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_usuarios()
    yield


app = FastAPI(title="SIALM API", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(produtos.router, prefix="/api/produtos", tags=["Produtos"])
app.include_router(setores.router, prefix="/api/setores", tags=["Setores"])
app.include_router(movimentacoes.router, prefix="/api/movimentacoes", tags=["Movimentações"])
app.include_router(relatorios.router, prefix="/api/relatorios", tags=["Relatórios"])