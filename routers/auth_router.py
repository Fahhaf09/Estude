from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models, database, auth

# O APIRouter substitui o 'app' do main.py
router = APIRouter(tags=["Auth"])

# Schemas de criação e login (Copie as classes UserCreate, UserLogin, Token do seu main.py aqui)
# Para simplificar, estamos assumindo que as classes BaseModel estão aqui ou importadas de um arquivo schemas.py

# ATENÇÃO: Defina suas classes BaseModel aqui ou as importe (usaremos a importação implícita)
class UserCreate(BaseModel):
    username: str; email: str; password: str; state: str
class UserLogin(BaseModel):
    email: str; password: str
class Token(BaseModel):
    access_token: str; token_type: str; user_id: int; username: str; state: str; level: int; xp: float


@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def criar_usuario(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter((models.User.email == user.email) | (models.User.username == user.username)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email ou nome de usuário já existe.")
    
    hashed_password = auth.criar_hash_senha(user.password)
    novo_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password, state=user.state, subscription_tier='FREE')
    db.add(novo_user); db.commit(); db.refresh(novo_user)
    return {"mensagem": "Usuário criado!", "id": novo_user.id}

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    
    if not user or not auth.verificar_senha(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    
    token = auth.criar_token_acesso(data={"sub": user.email})
    return {
        "access_token": token, "token_type": "bearer", "user_id": user.id, "username": user.username,
        "state": user.state, "level": user.current_level, "xp": user.current_xp
    }