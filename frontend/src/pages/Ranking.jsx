// Ranking.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://estude.onrender.com";

function Ranking() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState("nacional");
  const navigate = useNavigate();
  
  // Recupera dados do usuário logado para saber o estado dele
  const user = JSON.parse(localStorage.getItem("user"));

  const carregarRanking = async (estado = null) => {
    setLoading(true);
    try {
      const url = estado 
        ? `${API_BASE_URL}/ranking?state=${estado}` 
        : `${API_BASE_URL}/ranking`;
      
      const res = await axios.get(url);
      setLista(res.data);
    } catch (err) {
      alert("Erro ao carregar o ranking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarRanking(); // Começa com nacional
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '20px' }}>
      <button className="btn-outline" onClick={() => navigate("/dashboard")}>⬅ Voltar</button>
      
      <h1 style={{ textAlign: 'center', margin: '20px 0' }}>🏆 Leaderboard</h1>

      {/* BOTÕES DE FILTRO */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          className={filtroAtivo === "nacional" ? "btn-primary" : "btn-outline"}
          onClick={() => { setFiltroAtivo("nacional"); carregarRanking(); }}
        >
          🇧🇷 Nacional
        </button>
        <button 
          className={filtroAtivo === "estadual" ? "btn-primary" : "btn-outline"}
          onClick={() => { setFiltroAtivo("estadual"); carregarRanking(user.state); }}
        >
          📍 Meu Estado ({user.state})
        </button>
      </div>

      <div className="card">
        {loading ? <p>Carregando...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px' }}>#</th>
                <th style={{ textAlign: 'left' }}>Usuário</th>
                <th>Estado</th>
                <th>XP Total</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr 
                  key={item.username} 
                  style={{ 
                    backgroundColor: item.username === user.username ? '#f0f0ff' : 'transparent',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{item.posicao}º</td>
                  <td>{item.username} {item.username === user.username && "⭐"}</td>
                  <td style={{ textAlign: 'center' }}>{item.state}</td>
                  <td style={{ textAlign: 'center', color: '#6C63FF', fontWeight: 'bold' }}>{item.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Ranking;