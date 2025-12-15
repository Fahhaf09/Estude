from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models, database
# Importe APENAS os roteadores que existem no seu projeto
from routers import auth_router, user_router, quiz_router 
# Se tiver admin_router, descomente abaixo:
# from routers import admin_router 

# --- VARIÁVEIS DO BANCO DE DADOS ---
# Certifique-se de que a variável de ambiente DATABASE_URL está configurada no Render

# 1. CRIAÇÃO DE TABELAS
# Isso garante que as tabelas sejam criadas no PostgreSQL do Render no primeiro deploy.
try:
    models.Base.metadata.create_all(bind=database.engine)
    print("INFO: Tabelas criadas ou já existentes no banco de dados.")
except Exception as e:
    print(f"ERRO: Falha ao conectar ou criar tabelas: {e}")


# 2. INICIALIZAÇÃO DO APP
app = FastAPI(title="Plataforma Estude Modularizada")

# --- CONFIGURAÇÃO FINAL DO CORS (CORREÇÃO DO CABEÇALHO AUSENTE) ---
# A lista de origins é a maneira mais segura para evitar erros de regex.
origins = [
    "http://localhost:5173",                     # Ambiente de desenvolvimento local (Vite/React)
    "http://127.0.0.1:5173",                     # Outra forma de localhost
    "https://estude-gamma.vercel.app",           # SEU DOMÍNIO VERCEL PRINCIPAL
    "https://estude.onrender.com",               # SEU DOMÍNIO RENDER (self-reference)
    "https://estude-preview.vercel.app",         # Domínios de preview comuns da Vercel
    "https://estude-.*-santos09fah-gmailcoms-projects.vercel.app", 
]

# 3. APLICAÇÃO DO CORS MIDDLEWARE
# Este é o ponto crucial: Ele deve estar logo após a inicialização do app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    # Permite GET, POST, OPTIONS, etc.
    allow_headers=["*"],    # Permite Authorization, Content-Type, etc.
)
# ------------------------------------


# 4. INCLUSÃO DOS ROTAS
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(quiz_router.router)
# Se você tiver outros routers, inclua-os aqui:
# app.include_router(admin_router.router)


# Rota Raiz (Verificação de Status do Backend)
@app.get("/")
def read_root():
    return {"message": "Backend Estude Online está ativo e CORS configurado com sucesso."}