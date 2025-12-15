import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
const API_BASE_URL = "http://127.0.0.1:8000"; 

function StudyArea() {
  const [structure, setStructure] = useState({}); // Estrutura de conteúdo {Area: {Subject: [Topics]}}
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({}); // {area: '', subject: '', topic: ''}
  const navigate = useNavigate();
  const { trilha } = useParams(); // Lemos a trilha (VESTIBULAR/CONCURSO) da URL

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        // Usa API_BASE_URL na chamada para /content/structure
        const res = await axios.get(API_BASE_URL + `/content/structure?track=${trilha}`);
        setStructure(res.data);
      } catch (error) {
        console.error("Erro ao carregar estrutura de conteúdo:", error);
        alert("Não foi possível carregar o conteúdo para esta trilha. Verifique se o Backend está ativo.");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStructure();
  }, [trilha, navigate]);

  // Lógica para selecionar o filtro e avançar
  const selectFilter = (key, value) => {
    // Limpa os filtros de nível inferior ao selecionar um filtro de nível superior
    const newFilters = { [key]: value };
    if (key === 'area') newFilters.subject = '';
    if (key === 'subject') newFilters.topic = '';
    
    setSelectedFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Inicia o quiz com todos os filtros selecionados
  const startQuiz = () => {
    const { area, subject, topic } = selectedFilters;
    
    // Verifica se o filtro mais específico foi selecionado (topic)
    if (!topic) {
      alert("Por favor, selecione a Área, a Disciplina e o Tópico para começar o Quiz.");
      return;
    }

    // Navega para o Quiz, passando a trilha e os filtros (passaremos via state, para simplificar)
    navigate(`/quiz/${trilha}`, { state: { area, subject, topic } });
  };

  if (loading) return <div className="container" style={{ textAlign: 'center' }}>Carregando Áreas de Estudo...</div>;

  // Obtém os dados da estrutura para renderização
  const areas = Object.keys(structure);
  const subjects = structure[selectedFilters.area] || {};
  const topics = subjects[selectedFilters.subject] || [];

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <button className="btn-outline" onClick={() => navigate("/dashboard")} style={{ float: 'left', width: 'auto', marginBottom: 20 }}>
        ⬅ Voltar
      </button>
      
      <h1 style={{ textAlign: 'center', marginTop: 10 }}>📚 Sala de Estudos: {trilha}</h1>
      <p style={{ textAlign: 'center', color: '#666' }}>Selecione a Área, Disciplina e Tópico para iniciar o Quiz Adaptativo.</p>

      {/* --- NÍVEL 1: SELEÇÃO DA ÁREA --- */}
      <div className="card">
        <h3>1. Área de Estudo ({areas.length} áreas disponíveis)</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {areas.map(area => (
            <button 
              key={area}
              onClick={() => selectFilter('area', area)}
              className={selectedFilters.area === area ? "btn-primary" : "btn-outline"}
              style={{ flex: 1, minWidth: '150px' }}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* --- NÍVEL 2: SELEÇÃO DA DISCIPLINA --- */}
      {selectedFilters.area && (
        <div className="card">
          <h3>2. Disciplina (Matemática, História, etc.)</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.keys(subjects).map(subject => (
              <button 
                key={subject}
                onClick={() => selectFilter('subject', subject)}
                className={selectedFilters.subject === subject ? "btn-primary" : "btn-outline"}
                style={{ flex: 1, minWidth: '150px' }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- NÍVEL 3: SELEÇÃO DO TÓPICO --- */}
      {selectedFilters.subject && (
        <div className="card">
          <h3>3. Tópico Específico ({topics.length} conteúdos disponíveis)</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {topics.map(topic => (
              <button 
                key={topic}
                onClick={() => selectFilter('topic', topic)}
                className={selectedFilters.topic === topic ? "btn-success" : "btn-outline"}
                style={{ flex: 1, minWidth: '100px' }}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- BOTÃO FINAL DE START --- */}
      <button 
        onClick={startQuiz}
        className="btn-primary"
        style={{ marginTop: 30 }}
        disabled={!selectedFilters.topic} // Só habilita se o tópico for selecionado
      >
        INICIAR QUIZ ADAPTATIVO: {selectedFilters.topic || 'Selecione o Tópico'}
      </button>
    </div>
  );
}

export default StudyArea;