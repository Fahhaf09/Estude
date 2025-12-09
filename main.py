from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
from routers import auth_router, user_router, quiz_router # <--- Imports dos Routers
import os, math, random 
import google.genai as genai
from datetime import datetime

# --- CONFIGURAÇÃO DA GEMINI ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") 
client = None
if GEMINI_API_KEY:
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        client = None
else: 
    print("ATENÇÃO: Variável GEMINI_API_KEY não encontrada.")

# --- CONSTANTES GLOBAIS ---
K_FACTOR_ALUNO = 32
K_FACTOR_QUESTAO = 16

# --- FUNÇÕES DE SERVIÇO (ELO/GEMINI) ---
# Estas funções SÃO AS FONTES importadas pelo quiz_router.py

def calcular_probabilidade_acerto(habilidade_aluno, dificuldade_questao):
    return 1.0 / (1 + 10 ** ((dificuldade_questao - habilidade_aluno) / 400))

def atualizar_habilidade_elo(habilidade_atual, dificuldade_questao, acertou, k_factor):
    resultado_real = 1 if acertou else 0
    probabilidade_esperada = calcular_probabilidade_acerto(habilidade_atual, dificuldade_questao)
    nova_habilidade = habilidade_atual + k_factor * (resultado_real - probabilidade_esperada)
    return round(nova_habilidade, 2)

def gerar_feedback_ia(pergunta, resposta_aluno, resposta_correta, acertou, subject, topic):
    if client is None:
        if acertou: return f"IA Simulada: Excelente! Você dominou o tópico de {topic}."
        else: return f"IA Simulada: Reveja o conceito de {topic} em {subject}. A resposta correta é: {resposta_correta}."
    prompt = f"""Atue como um professor didático. Você está corrigindo uma questão de {subject} sobre {topic}.
    Resposta do Aluno: {resposta_aluno} | Resposta Correta: {resposta_correta}"""
    try:
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        return response.text
    except Exception as e:
        return "Desculpe, a IA Gemini está indisponível no momento."

# ---------------------------------------------------------------------------------------

# 1. CRIAÇÃO DE TABELAS (Executar APENAS uma vez)
models.Base.metadata.create_all(bind=database.engine)

# 2. INICIALIZAÇÃO DO APP
app = FastAPI(title="Plataforma Estude Modularizada")

# 3. CONFIGURAÇÃO DO CORS (USANDO APENAS REGEX)
app.add_middleware(
    CORSMiddleware,
    # Esta Regex abrange: localhost, o Render e qualquer subdomínio da Vercel
    allow_origin_regex=r"https?://(localhost:5173|estude\.onrender\.com|estude-.*-santos09fah-gmailcoms-projects\.vercel\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INCLUIR ROTAS MODULARIZADAS ---

app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(quiz_router.router)