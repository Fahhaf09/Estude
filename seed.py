from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Limpa todas as questões para começar do zero
db.query(models.Question).delete()

# Lista de Questões de Exemplo
questoes = [
    {
        "subject": "Matemática", "topic": "Geometria",
        "content_text": "Qual é a área de um quadrado com lado de 5cm?",
        "difficulty_level": 800, "correct_option": "25cm²", 
        "track_tag": "VESTIBULAR", "area_tag": "Matemática e suas Tecnologias" # <--- NOVO
    },
    {
        "subject": "Matemática", "topic": "Álgebra",
        "content_text": "Resolva para x: 2x + 10 = 20",
        "difficulty_level": 1000, "correct_option": "5", 
        "track_tag": "CONCURSO", "area_tag": "Raciocínio Lógico"
    },
    {
        "subject": "História", "topic": "Brasil Império",
        "content_text": "Quem proclamou a independência do Brasil?",
        "difficulty_level": 900, "correct_option": "D. Pedro I", 
        "track_tag": "VESTIBULAR", "area_tag": "Ciências Humanas e suas Tecnologias"
    },
    {
        "subject": "Física", "topic": "Cinemática",
        "content_text": "Um carro viaja a 100km/h por 2 horas. Qual a distância percorrida?",
        "difficulty_level": 1100, "correct_option": "200km", 
        "track_tag": "CONCURSO", "area_tag": "Raciocínio Lógico"
    }
]

print("--- Adicionando Questões ---")
for q in questoes:
    nova_q = models.Question(
        subject=q['subject'], content_text=q['content_text'],
        difficulty_level=q['difficulty_level'], correct_option=q['correct_option'],
        topic=q['topic'], track_tag=q['track_tag'], area_tag=q['area_tag']
    )
    db.add(nova_q)
    print(f"Criada: {q['content_text']}")

db.commit()
print("--- Concluído! Banco populado. ---")