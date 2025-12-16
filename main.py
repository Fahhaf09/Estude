from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
# Importe APENAS os roteadores que existem no seu projeto.
from routers import auth_router, user_router, quiz_router 
# Se você tiver admin_router, descomente abaixo:
# from routers import admin_router 

# --- CONFIGURAÇÃO DE AMBIENTE ---
# A inicialização de IA (Gemini/ELO) deve ser movida para um arquivo de serviço (ex: services/ai_service.py)

# 1. CRIAÇÃO DE TABELAS
# Garante que o banco de dados esteja pronto antes de tudo.
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO: Tabelas criadas ou já existentes.")
except Exception as e:
    print(f"ERRO: Falha ao conectar ou criar tabelas: {e}")


# 2. INICIALIZAÇÃO DO APP
app = FastAPI(title="Plataforma Estude Modularizada")

# --- CONFIGURAÇÃO DE CORS (AQUI É O PONTO CRÍTICO) ---
# Usamos a lista explícita para máxima compatibilidade.
origins = [
    "http://localhost:5173",                     
    "http://127.0.0.1:5173",                     
    "https://estude-gamma.vercel.app",           # SEU DOMÍNIO VERCEL PRINCIPAL
    "https://estude.onrender.com",               # SEU DOMÍNIO RENDER
    "https://estude-preview.vercel.app",         
    "https://estude-.*-santos09fah-gmailcoms-projects.vercel.app", 
]

# 3. APLICAÇÃO DO CORS MIDDLEWARE
# Esta deve ser a PRIMEIRA ação de middleware após a inicialização do app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------------------------


# 4. INCLUSÃO DOS ROTAS (Deve vir DEPOIS do middleware)
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(quiz_router.router)
# ... inclua outros routers aqui


# Rota Raiz (Verificação de Status)
@app.get("/")
def read_root():
    return {"message": "Backend Estude Online está ativo e CORS configurado com sucesso."}