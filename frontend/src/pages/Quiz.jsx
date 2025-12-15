import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Inclui useLocation

// 🌐 URL de Produção (Modifique após o deploy do Backend)
const API_BASE_URL = "https://estude.onrender.com"; 

function Quiz() {
  const [questao, setQuestao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();
  const { trilha } = useParams(); 
  const location = useLocation(); 
  
  // Lê o objeto do usuário armazenado no Login
  const user = JSON.parse(localStorage.getItem("user"));

  // Obtém os filtros passados pelo StudyArea (Área, Disciplina, Tópico)
  const { area, subject, topic } = location.state || {};

  const carregarQuestao = async () => {
 setLoading(true);
 setResultado(null);
 try {
   const userId = user.user_id;
   
   // --- CONSTRÓI A URL COM TODOS OS FILTROS ---
      // Usa API_BASE_URL e todos os filtros passados
   const url = API_BASE_URL + `/questoes/jogar/${userId}?track=${trilha}&area=${area}&subject=${subject}&topic=${topic}`;
    
   const res = await axios.get(url);
   
   setQuestao(res.data);
 } catch (err) {
  if (err.response && err.response.status === 403) {
   // Se o limite foi atingido (403 Forbidden - Monetização)
   alert(err.response.data.detail);
   navigate("/dashboard");
  } else {
   alert("Erro ao carregar questão. Verifique se há questões no banco ou filtros corretos.");
   navigate("/dashboard"); // Volta para evitar loop infinito
  }
 } finally {
   setLoading(false);
 }
  };

  useEffect(() => {
 if (!user || !topic) { // Verifica se o usuário existe e se os filtros foram passados
     alert("Selecione o Tópico de estudo na Sala de Estudos.");
        navigate(`/study/${trilha}`);
        return;
    }
 carregarQuestao();
  }, []);

  const responder = async (resposta) => {
 try {
      // Usa API_BASE_URL para ENVIAR RESPOSTA
   const res = await axios.post(API_BASE_URL + "/questoes/responder", { 
  user_id: user.user_id,
  question_id: questao.id,
  resposta_enviada: resposta
   });

   setResultado(res.data);
   
   if (res.data.acertou) {
    // Atualiza o XP local para a Dashboard
    const userAtualizado = { ...user, xp: res.data.saldo_xp };
    localStorage.setItem("user", JSON.stringify(userAtualizado));
   }
   
 } catch (err) {
   alert("Erro ao enviar resposta");
 }
  };

  if (loading) return <div className="container" style={{ textAlign: 'center' }}>Carregando desafio...</div>;
  if (!questao) return null; // Não renderiza se a questão não foi carregada (após erro/redirecionamento)

  return (
 <div className="container" style={{ maxWidth: "600px" }}>
   <button className="btn-outline" onClick={() => navigate("/dashboard")} style={{ float: "left", width: "auto" }}>⬅ Voltar</button>
   
   {resultado ? (
  <div className="card" style={{ border: `2px solid ${resultado.acertou ? '#4CAF50' : '#F44336'}` }}>
   <h2 style={{ color: resultado.acertou ? '#4CAF50' : '#F44336' }}>
    {resultado.mensagem}
   </h2>
   
   <div style={{ backgroundColor: "#f9f9f9", padding: 15, borderRadius: 5, margin: "20px 0", fontStyle: "italic" }}>
    <strong>🎓 Feedback do Professor IA:</strong>
    <p>{resultado.feedback_ia}</p>
   </div>

   {resultado.xp_ganho > 0 && <p><strong>+{resultado.xp_ganho} XP</strong> adicionados à sua conta.</p>}

   {resultado.nova_medalha && <p style={{ color: '#FFD700', fontWeight: 'bold' }}>Medalha Desbloqueada: {resultado.nova_medalha}</p>}

   <button className="btn-primary" onClick={carregarQuestao} style={{ width: "auto" }}>
    PRÓXIMA QUESTÃO ➡
   </button>
  </div>
   ) : (
  <>
   <div style={{ display: "flex", justifyContent: "space-between", color: "gray" }}>
     <span>{trilha} | {questao.subject}</span> 
     <span>Dificuldade ELO: {Math.round(questao.difficulty)}</span>
    </div>
   
   <h2 style={{ margin: "20px 0 30px 0" }}>{questao.text}</h2>

   <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {questao.options.map((opcao, index) => (
    <button 
     key={index} 
     onClick={() => responder(opcao)}
     className="btn-outline"
    >
     {opcao}
    </button>
    ))}
   </div>
  </>
   )}
 </div>
  );
}

export default Quiz;