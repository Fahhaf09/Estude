from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, database

router = APIRouter(tags=["Users & Ranking"])

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
def obter_ranking(state: str = None, db: Session = Depends(database.get_db)):
    query = db.query(models.User)
    
    # Se o parâmetro state for enviado, filtra por ele
    if state:
        query = query.filter(models.User.state == state.upper())
    
    # Ordena pelo XP mais alto e pega os top 10
    ranking = query.order_by(desc(models.User.current_xp)).limit(10).all()
    
    return [
        {
            "posicao": idx + 1,
            "username": user.username,
            "xp": round(user.current_xp, 1),
            "level": user.current_level,
            "state": user.state
        } for idx, user in enumerate(ranking)
    ]

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