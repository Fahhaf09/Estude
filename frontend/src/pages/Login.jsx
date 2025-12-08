import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://estude.onrender.com";

function Login() {
  const navigate = useNavigate();
  const [isCadastro, setIsCadastro] = useState(false);
  
  // Estado completo do formulário
  const [formData, setFormData] = useState({
    username: "", email: "", password: "",
    first_name: "", last_name: "", gender: "Masculino",
    cpf: "", phone_fixed: "", phone_mobile: "", state: "SP",
    goal_vestibular: "", goal_course: "", goal_concurso: "",
    perfil: "vestibular" // 'vestibular' ou 'concurso'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isCadastro ? "/cadastro" : "/login";
    
    // Payload simplificado para login ou completo para cadastro
    const payload = isCadastro ? formData : { email: formData.email, password: formData.password };

    try {
      const res = await axios.post(API_BASE_URL + endpoint, payload);
      if (!isCadastro) {
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      } else {
        alert("Cadastro realizado com sucesso! Faça seu login.");
        setIsCadastro(false);
      }
    } catch (err) {
      alert("Erro na operação. Verifique os dados ou se o CPF/E-mail já existem.");
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif' }}>
      
      {/* LADO ESQUERDO: MARKETING (Oculto no mobile se desejar) */}
      <div style={{ flex: 0.6, backgroundColor: '#1f2937', color: 'white', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ color: '#6C63FF' }}>🧠 PLATAFORMA ELO</h1>
        <p>"A educação é o passaporte para o futuro."</p>
        <div style={{ marginTop: '20px', borderLeft: '4px solid #6C63FF', paddingLeft: '20px' }}>
          <h4>Nossos Planos</h4>
          <p>• Padrão: 7 questões/dia<br/>• Premium: Ilimitado + IA<br/>• Avançado: Mentoria</p>
        </div>
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center' }}>{isCadastro ? 'Cadastro Completo' : 'Login'}</h2>

          <form onSubmit={handleAuth}>
            {isCadastro ? (
              <>
                <div className="grid-2">
                  <input type="text" name="first_name" placeholder="Nome" onChange={handleChange} required />
                  <input type="text" name="last_name" placeholder="Sobrenome" onChange={handleChange} required />
                </div>
                <div className="grid-2">
                   <select name="gender" onChange={handleChange} style={inputStyle}>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <input type="text" name="cpf" placeholder="CPF" onChange={handleChange} required />
                </div>
                <div className="grid-2">
                  <input type="text" name="phone_fixed" placeholder="Fixo" onChange={handleChange} />
                  <input type="text" name="phone_mobile" placeholder="Celular" onChange={handleChange} required />
                </div>
                <input type="text" name="username" placeholder="Nome de Usuário (Nick)" onChange={handleChange} required />
                
                <h4 style={{marginTop: '20px'}}>Foco de Estudo</h4>
                <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                   <button type="button" onClick={() => setFormData({...formData, perfil: 'vestibular'})} style={formData.perfil === 'vestibular' ? btnActive : btnInactive}>Vestibular</button>
                   <button type="button" onClick={() => setFormData({...formData, perfil: 'concurso'})} style={formData.perfil === 'concurso' ? btnActive : btnInactive}>Concurso</button>
                </div>

                {formData.perfil === 'vestibular' ? (
                  <div className="grid-2">
                    <input type="text" name="goal_vestibular" placeholder="Qual Vestibular?" onChange={handleChange} />
                    <input type="text" name="goal_course" placeholder="Qual Curso?" onChange={handleChange} />
                  </div>
                ) : (
                  <input type="text" name="goal_concurso" placeholder="Qual Concurso Almejado?" onChange={handleChange} />
                )}
              </>
            ) : null}

            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />

            <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>
              {isCadastro ? 'SALVAR CADASTRO' : 'ENTRAR'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <a href="#" onClick={() => setIsCadastro(!isCadastro)} style={{ color: '#6C63FF', fontWeight: 'bold' }}>
              {isCadastro ? 'Voltar para Login' : 'Criar Nova Conta'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', border: '2px solid #e0e0e0', borderRadius: '8px' };
const btnActive = { backgroundColor: '#6C63FF', color: 'white', flex: 1 };
const btnInactive = { backgroundColor: '#e0e0e0', color: '#666', flex: 1 };

export default Login;