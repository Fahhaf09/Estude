from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./estudos.db")

print(f"URL de Conexão Lida: {SQLALCHEMY_DATABASE_URL}") # <--- ADICIONE ESTA LINHA TEMPORARIAMENTE

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # Para PostgreSQL, geralmente não precisa de connect_args.
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()