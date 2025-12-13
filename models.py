from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base 

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # 🚨 CORREÇÃO: Removida a linha duplicada 'state = Column(String())'
    
    current_xp = Column(Float, default=0.0) # ELO do Aluno (Float)
    current_level = Column(Integer, default=1)
    
    # --- NOVOS CAMPOS DE CADASTRO ---
    first_name = Column(String)
    last_name = Column(String)
    gender = Column(String)
    cpf = Column(String, unique=True)
    phone_fixed = Column(String)
    phone_mobile = Column(String)
    state = Column(String(2)) # DEFINIÇÃO ÚNICA E CORRETA para siglas (ex: 'SP', 'RJ')
    
    # Perfilamento
    goal_vestibular = Column(String) # Ex: ENEM, FUVEST
    goal_course = Column(String)     # Ex: Medicina, Engenharia
    goal_concurso = Column(String)   # Ex: PF, Banco do Brasil
    
    # --- CAMPOS DE ASSINATURA ---
    subscription_tier = Column(String, default='FREE') # 'FREE' ou 'PREMIUM'
    daily_questions_count = Column(Integer, default=0)
    last_login_date = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("UserAttempt", back_populates="student")
    badges = relationship("Badge", back_populates="student")

class Question(Base):
    __tablename__ = 'questions'
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    topic = Column(String)
    content_text = Column(String)
    difficulty_level = Column(Float, default=1000.0) # Dificuldade ELO da Questão
    correct_option = Column(String)
    track_tag = Column(String, default="Geral") # <--- NOVO CAMPO: Filtro por Trilha
    area_tag = Column(String, default="Geral") # <--- NOVO CAMPO: Área (Ex: Matemática e suas Tecnologias)

class UserAttempt(Base):
    __tablename__ = 'user_attempts'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    question_id = Column(Integer, ForeignKey('questions.id'))
    is_correct = Column(Boolean)
    timestamp = Column(DateTime, default=datetime.utcnow)
    student = relationship("User", back_populates="attempts")
    question = relationship("Question")

class Badge(Base):
    __tablename__ = 'badges'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String)
    icon = Column(String)
    student = relationship("User", back_populates="badges")