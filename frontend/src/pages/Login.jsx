import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🌐 URL de Produção
const API_BASE_URL = "https://estude.onrender.com";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(API_BASE_URL + "/login", formData);
      
      // Armazena o token e dados do usuário
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
      
    } catch (err) {
      setMessage("❌ Credenciais inválidas. Verifique seu e-mail e senha.");
      console.error("Erro detalhado:", err.response ? err.response.data : err);
    }
  };
  
  // Estilos auxiliares
  const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', border: '2px solid #e0e0e0', borderRadius: '8px' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LADO ESQUERDO: MARKETING */}
      <div style={{ flex: 0.6, backgroundColor: '#1f2937', color: 'white', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ color: '#6C63FF' }}>🧠 PLATAFORMA ELO</h1>
        <p>"A educação é o passaporte para o futuro."</p>
      </div>

      {/* LADO DIREITO: FORMULÁRIO DE LOGIN */}
      <div style={{ flex: 1, padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 style={{ textAlign: 'center' }}>Login</h2>

          {message && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}

          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required style={inputStyle} />
            <input type="password" name="password" placeholder="Senha" onChange={handleChange} required style={inputStyle} />

            <button type="submit" className="btn-primary" style={{marginTop: '20px', width: '100%'}}>
              ENTRAR
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="#" onClick={() => navigate("/cadastro")} style={{ color: '#6C63FF', fontWeight: 'bold' }}>
              Criar Nova Conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;