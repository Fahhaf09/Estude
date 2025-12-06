from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, database

router = APIRouter(tags=["Users and Monetization"])

# Rota para obter perfil, ranking e subscribe

@router.get("/usuarios/{user_id}")
def ler_perfil(user_id: int, db: Session = Depends(database.get_db)):
    # ... (Copie aqui o código completo da rota /usuarios/{user_id} do seu main.py) ...
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    medalhas = [{"name": b.name, "icon": b.icon} for b in user.badges]

    # Inclua a contagem diária para o dashboard
    return {
        "username": user.username, "email": user.email, "state": user.state, 
        "level": user.current_level, "xp": user.current_xp, "badges": medalhas,
        "subscription_tier": user.subscription_tier, 
        "daily_questions_count": user.daily_questions_count 
    }

@router.get("/ranking")
def obter_ranking(estado: str = None, db: Session = Depends(database.get_db)):
    # ... (Copie aqui o código completo da rota /ranking do seu main.py) ...
    query = db.query(models.User)
    if estado and estado != "null":
        query = query.filter(models.User.state == estado)
    top_alunos = query.order_by(desc(models.User.current_xp)).limit(10).all()
    ranking_formatado = []
    for i, aluno in enumerate(top_alunos):
        ranking_formatado.append({"posicao": i + 1, "username": aluno.username, "xp": aluno.current_xp, "level": aluno.current_level, "state": aluno.state})
    return ranking_formatado

@router.post("/subscribe/{user_id}")
def ativar_premium(user_id: int, db: Session = Depends(database.get_db)):
    # ... (Copie aqui o código completo da rota /subscribe/{user_id} do seu main.py) ...
    aluno = db.query(models.User).filter(models.User.id == user_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    aluno.subscription_tier = 'PREMIUM'
    aluno.daily_questions_count = 0 
    db.commit()
    return {"status": "success", "message": "Plano PREMIUM ativado com sucesso!", "tier": "PREMIUM"}