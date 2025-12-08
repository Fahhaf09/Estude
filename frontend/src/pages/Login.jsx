import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
// Em produção, isso deve ser "https://seubackend.render.com"
const API_BASE_URL = "https://estude.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Usa a URL base para LOGIN
      const res = await axios.post(API_BASE_URL + "/login", { email, password });
 
      localStorage.setItem("user", JSON.stringify(res.data)); 
 
      console.log("Login OK. Dados salvos:", res.data);
 
      navigate("/dashboard");
 
    } catch (err) {
      alert("Erro no login! Verifique email e senha.");
    }
  };
  
  const handleCadastro = async () => {
    // Validação simples
    if (!username || !email || !password) {
        alert("Preencha Nome, Email e Senha para cadastrar!");
        return;
    }

    try {
      // MUDANÇA AQUI: Agora usa API_BASE_URL para o cadastro
      await axios.post(API_BASE_URL + "/cadastro", { 
        username: username,
        email: email, 
        password: password, 
        state: "SP"
      });
      alert(`Usuário ${username} cadastrado! Agora clique em ENTRAR.`);
    } catch (err) {
      // Mostra o erro real se possível
      console.error(err);
      alert("Erro ao cadastrar. O Email ou o Nome já existem!");
    }
  };

  return (
    <div style={{ padding: 50, maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>Acesso à Plataforma</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Campo de Nome (Novo) */}
        <input 
            type="text" 
            placeholder="Seu Nome (Apenas para cadastro)" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ padding: 10 }} 
        />

        <input 
            type="email" 
            placeholder="Seu Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ padding: 10 }}
        />
        
        <input 
            type="password" 
            placeholder="Sua Senha" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ padding: 10 }}
        />
      </div>

      <br/>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button 
            onClick={handleLogin}
            style={{ padding: "10px 30px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
        >
            ENTRAR
        </button>
        
        <button 
            onClick={handleCadastro} 
            style={{ padding: "10px 30px", backgroundColor: "#2196F3", color: "white", border: "none", cursor: "pointer" }}
        >
            CADASTRAR
        </button>
      </div>
      
      <p style={{fontSize: "12px", color: "gray"}}>*Para entrar, basta Email e Senha. Para cadastrar, preencha o Nome também.</p>
    </div>
  );
}

export default Login;