from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import models
import database
import auth

router = APIRouter(tags=["Auth"])

# --- SCHEMAS ATUALIZADOS ---
Class EstadosBrasil(str, Enum):
    AC = "Acre"
    AL = "Alagoas"
    AP = "Amapá"
    AM = "Amazonas"
    BA = "Bahia"
    CE = "Ceará"
    DF = "Distrito Federal"
    ES = "Espírito Santo"
    GO = "Goiás"
    MA = "Maranhão"
    MT = "Mato Grosso"
    MS = "Mato Grosso do Sul"
    MG = "Minas Gerais"
    PA = "Pará"
    PB = "Paraíba"
    PR = "Paraná"
    PE = "Pernambuco"
    PI = "Piauí"
    RJ = "Rio de Janeiro"
    RN = "Rio Grande do Norte"
    RS = "Rio Grande do Sul"
    RO = "Rondônia"
    RR = "Roraima"
    SC = "Santa Catarina"
    SP = "São Paulo"
    SE = "Sergipe"
    TO = "Tocantins"

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    gender: str
    cpf: str
    phone_fixed: Optional[str] = None
    phone_mobile: str
    state: EstadosBrasil
    # Perfilamento
    goal_vestibular: Optional[str] = None
    goal_course: Optional[str] = None
    goal_concurso: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    state: str
    level: int
    xp: float


# --- ROTA DE CADASTRO COMPLETO ---
@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def criar_usuario(user: UserCreate, db: Session = Depends(database.get_db)):
    # 1. Verifica se E-mail, Username ou CPF já existem
    db_user = db.query(models.User).filter(
        (models.User.email == user.email) | 
        (models.User.username == user.username) |
        (models.User.cpf == user.cpf)
    ).first()
    
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="E-mail, Usuário ou CPF já cadastrados."
        )
    
    # 2. Criptografa a senha
    hashed_password = auth.criar_hash_senha(user.password)
    
    # 3. Cria o novo objeto do usuário com os novos campos
    novo_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        gender=user.gender,
        cpf=user.cpf,
        phone_fixed=user.phone_fixed,
        phone_mobile=user.phone_mobile,
        state=user.state,
        goal_vestibular=user.goal_vestibular,
        goal_course=user.goal_course,
        goal_concurso=user.goal_concurso,
        subscription_tier='FREE'  # Padrão inicial
    )
    
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    
    return {"mensagem": "Usuário criado com sucesso!", "id": novo_user.id}


# --- ROTA DE LOGIN (Mantida igual) ---
@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    
    password_valid = auth.verificar_senha(
        user_data.password, user.hashed_password
    )
    if not user or not password_valid:
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
    
    token = auth.criar_token_acesso(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
        "state": user.state,
        "level": user.current_level,
        "xp": user.current_xp
    }