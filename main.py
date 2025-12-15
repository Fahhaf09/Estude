from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router # Importe seus roteadores, se necessário
from routers import admin_router # Exemplo de outro roteador
from routers import question_router # Exemplo de outro roteador

# 1. INICIALIZAÇÃO DO APP
app = FastAPI(title="Plataforma Estude Modularizada")

# --- CONFIGURAÇÃO FINAL DO CORS ---
# Liste explicitamente todos os domínios que podem acessar a API (Backend)
origins = [
    "http://localhost:5173",                     # Ambiente de desenvolvimento local (Vite/React)
    "http://127.0.0.1:5173",                     # Outra forma de localhost
    "https://estude-gamma.vercel.app",           # SEU DOMÍNIO VERCEL PRINCIPAL
    "https://estude.onrender.com",               # SEU DOMÍNIO RENDER (self-reference)
    # Adicione abaixo qualquer domínio de preview da Vercel que você use
    "https://estude-preview.vercel.app",
    "https://estude-.*-santos09fah-gmailcoms-projects.vercel.app", 
]

# 2. APLICAÇÃO DO CORS MIDDLEWARE
# Este é o ponto crucial: Ele adiciona os cabeçalhos de CORS a *toda* resposta.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],    # Permite GET, POST, OPTIONS, etc.
    allow_headers=["*"],    # Permite Authorization, Content-Type, etc.
)
# ------------------------------------

# 3. INCLUSÃO DOS ROTAS (Importe conforme seu projeto)
app.include_router(auth_router.router)
# app.include_router(admin_router.router)
# app.include_router(question_router.router)
# ... inclua outros roteadores aqui

# Rota Raiz (Útil para saber se o servidor está no ar)
@app.get("/")
def read_root():
    return {"message": "Backend Estude Online está ativo e CORS configurado."}