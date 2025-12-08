import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
const API_BASE_URL = "https://estude.onrender.com";

function Ranking() {
  const [lista, setLista] = useState([]);
  const [filtro, setFiltro] = useState(""); // Vazio = Nacional
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const carregarRanking = async (estado) => {
    try {
      // Constrói a URL usando API_BASE_URL
      const url = estado 
        ? `${API_BASE_URL}/ranking?estado=${estado}` 
        : `${API_BASE_URL}/ranking`; // Rota nacional
        
      const res = await axios.get(url);
      setLista(res.data);
    } catch (err) {
      alert("Erro ao carregar ranking. Verifique a conexão com o Backend.");
    }
  };

  useEffect(() => {
    carregarRanking(""); // Carrega Nacional ao abrir
  }, []);

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
      <button onClick={() => navigate("/dashboard")} style={{ float: "left" }}>⬅ Voltar</button>
      
      <h1>🏆 Ranking de Estudantes</h1>

      <div style={{ marginBottom: 20 }}>
        <button 
            onClick={() => { setFiltro(""); carregarRanking(""); }}
            style={{ backgroundColor: filtro === "" ? "#ffd700" : "#eee", marginRight: 10 }}
        >
            🇧🇷 Nacional
        </button>
        <button 
            onClick={() => { setFiltro(user.state); carregarRanking(user.state); }}
            style={{ backgroundColor: filtro === user.state ? "#4CAF50" : "#eee", color: filtro === user.state ? "white" : "black" }}
        >
            📍 Meu Estado ({user.state})
        </button>
      </div>

      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: 10 }}>#</th>
            <th>Aluno</th>
            <th>Estado</th>
            <th>Nível</th>
            <th>XP Total</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item) => (
            <tr key={item.posicao} style={{ backgroundColor: item.username === user.username ? "#e8f5e9" : "white" }}>
              <td style={{ padding: 10, fontWeight: "bold" }}>{item.posicao}º</td>
              <td>{item.username} {item.username === user.username && "(Você)"}</td>
              <td>{item.state}</td>
              <td>{item.level}</td>
              <td style={{ color: "#2196F3", fontWeight: "bold" }}>{item.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;