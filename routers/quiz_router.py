from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import func
import random
import models, database, main as main_logic # <--- IMPORTAÇÃO CORRETA

router = APIRouter(tags=["Quiz and Adaptive Learning"])

# Schema necessário para a rota POST /responder
class RespostaAluno(BaseModel):
    user_id: int; question_id: int; resposta_enviada: str
class QuestionCreate(BaseModel):
    subject: str
    topic: str
    content_text: str
    difficulty_level: float
    correct_option: str
    track_tag: str


@router.get("/questoes/jogar/{user_id}")
def pegar_questao_adaptativa(
    user_id: int, 
    track: str, 
    area: str,       # <--- NOVO
    subject: str,    # <--- NOVO
    topic: str,      # <--- NOVO
    db: Session = Depends(database.get_db)
    ):

    aluno = db.query(models.User).filter(models.User.id == user_id).first()
    if not aluno: raise HTTPException(status_code=404, detail="Aluno não encontrado")
    
    # --- LÓGICA DE LIMITE DIÁRIO ---
    LIMITE_DIARIO = 7
    if aluno.subscription_tier == 'FREE' and aluno.daily_questions_count >= LIMITE_DIARIO:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Limite de {LIMITE_DIARIO} questões diárias atingido. Assine o Plano PREMIUM para acesso ilimitado!"
        )

    habilidade_aluno = aluno.current_xp
    query = db.query(models.Question).filter(
        models.Question.track_tag == track,
        models.Question.area_tag == area,
        models.Question.subject == subject,
        models.Question.topic == topic
    )
    
    # ELO: Busca a questão com a dificuldade mais próxima da habilidade do aluno.
    questao = query.order_by(
        func.abs(models.Question.difficulty_level - habilidade_aluno)
    ).first()

    if not questao: raise HTTPException(status_code=404, detail=f"Nenhuma questão encontrada para a trilha: {track}")
    
    # Incrementa a contagem de questões respondidas (Será salvo no commit do responder)
    aluno.daily_questions_count += 1
    db.commit() # Salva a nova contagem imediatamente
    
    opcoes = [questao.correct_option, "Resposta Errada 1", "Resposta Errada 2", "Resposta Errada 3"]
    random.shuffle(opcoes)
    
    return {
        "id": questao.id, "subject": questao.subject, "text": questao.content_text,
        "difficulty": questao.difficulty_level, "options": opcoes,
        "remaining_questions": LIMITE_DIARIO - aluno.daily_questions_count
    }


@router.post("/questoes/responder")
def responder_questao(dados: RespostaAluno, db: Session = Depends(database.get_db)):
    questao = db.query(models.Question).filter(models.Question.id == dados.question_id).first()
    aluno = db.query(models.User).filter(models.User.id == dados.user_id).first()
    
    if not questao or not aluno: raise HTTPException(status_code=404, detail="Dados não encontrados")
    
    acertou = (dados.resposta_enviada == questao.correct_option)
    xp_ganho = 0; mensagem = "Errou..."; nova_medalha = None

    # --- Lógica ELO (Usando main_logic.função) ---
    K_ALUNO = main_logic.K_FACTOR_ALUNO
    K_QUESTAO = main_logic.K_FACTOR_QUESTAO

    # 1. Atualiza ELO do Aluno
    aluno.current_xp = main_logic.atualizar_habilidade_elo(aluno.current_xp, questao.difficulty_level, acertou, K_ALUNO)
    
    # 2. Atualiza ELO da Questão
    nova_dificuldade_questao = main_logic.atualizar_habilidade_elo(questao.difficulty_level, aluno.current_xp, not acertou, K_QUESTAO)
    
    # Garante limite mínimo
    questao.difficulty_level = max(500.0, round(nova_dificuldade_questao, 2))

    # --- Lógica de Gamificação ---
    if acertou:
        xp_ganho = int(questao.difficulty_level * 0.05)
        aluno.current_xp += xp_ganho
        mensagem = "Acertou! 🎉"
        
        # ... (Lógica de Medalhas continua aqui) ...

    # --- FEEDBACK GEMINI ---
    feedback_explicativo = main_logic.gerar_feedback_ia(questao.content_text, dados.resposta_enviada, questao.correct_option, acertou, questao.subject, questao.topic)
        
    tentativa = models.UserAttempt(user_id=aluno.id, question_id=questao.id, is_correct=acertou)
    db.add(tentativa); db.commit()
    
    return {
        "acertou": acertou, "xp_ganho": xp_ganho, "mensagem": mensagem,
        "feedback_ia": feedback_explicativo, "saldo_xp": aluno.current_xp, "nova_medalha": nova_medalha
    }

@router.post("/admin/add_question", status_code=status.HTTP_201_CREATED)
def adicionar_questao_admin(questao_data: QuestionCreate, db: Session = Depends(database.get_db)):
    """
    Adiciona uma nova questão ao banco de dados.
    (Em produção, esta rota seria protegida por um token de administrador).
    """
    nova_questao = models.Question(
        subject=questao_data.subject,
        topic=questao_data.topic,
        content_text=questao_data.content_text,
        difficulty_level=questao_data.difficulty_level,
        correct_option=questao_data.correct_option,
        track_tag=questao_data.track_tag
    )
    db.add(nova_questao)
    db.commit()
    return {"message": "Questão adicionada com sucesso!", "id": nova_questao.id}

@router.get("/content/structure")
def get_content_structure(track: str, db: Session = Depends(database.get_db)):
    """
    Retorna a estrutura completa de Áreas, Disciplinas e Tópicos disponíveis
    para a Trilha selecionada.
    """
    
    # 1. Busca todas as questões ativas da trilha
    questoes = db.query(models.Question).filter(models.Question.track_tag == track).all()
    
    # Dicionário para organizar a estrutura: {Area: {Subject: [Topics]}}
    estrutura = {}
    
    for q in questoes:
        area = q.area_tag
        subject = q.subject
        topic = q.topic
        
        if area not in estrutura:
            estrutura[area] = {}
        
        if subject not in estrutura[area]:
            estrutura[area][subject] = set() # Usamos set para evitar tópicos duplicados
            
        estrutura[area][subject].add(topic)

    # Converte os sets de tópicos para listas antes de retornar
    estrutura_final = {}
    for area, subjects in estrutura.items():
        estrutura_final[area] = {}
        for subject, topics_set in subjects.items():
            estrutura_final[area][subject] = list(topics_set)
            
    return estrutura_final