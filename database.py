# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os  # <-- CORREÇÃO CRÍTICA: Importar o módulo OS para ler variáveis de ambiente

# LER VARIÁVEL DE AMBIENTE DO RENDER
DATABASE_URL = os.environ.get("DATABASE_URL")

# Verifica se a URL do banco existe
if DATABASE_URL is None:
    # Se não houver URL de produção, usa SQLite local (Para desenvolvimento/teste)
    SQLALCHEMY_DATABASE_URL = "sqlite:///./estudos.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # Render (PostgreSQL)
    SQLALCHEMY_DATABASE_URL = DATABASE_URL
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()