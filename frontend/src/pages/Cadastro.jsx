import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 🌐 URL do Backend (Render)
const API_BASE_URL = "https://estude.onrender.com";

// Lista de estados para o campo SELECT
const estados = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", 
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", 
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", 
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", 
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

const initialFormState = {
  username: "", email: "", password: "",
  first_name: "", last_name: "", gender: "Masculino",
  cpf: "", phone_fixed: "", phone_mobile: "", state: "São Paulo", // Valor inicial válido do Enum
  goal_vestibular: "", goal_course: "", goal_concurso: "",
  perfil: "vestibular" // Campo auxiliar APENAS no Frontend
};

const inputStyle = { width: '100%', padding: '12px', margin: '8px 0', border: '2px solid #e0e0e0', borderRadius: '8px' };
const btnActive = { backgroundColor: '#6C63FF', color: 'white', flex: 1 };
const btnInactive = { backgroundColor: '#e0e0e0', color: '#666', flex: 1 };


function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // --- LIMPEZA DE PAYLOAD CRÍTICA (CORRIGINDO O ERRO 422) ---
    let payload = { ...formData };
    
    // 1. Remove o campo 'perfil' que não existe no Backend
    delete payload.perfil;
    
    // 2. Converte strings vazias ("") em null para campos opcionais (Optional[str])
    // Se o usuário não preencher, o Backend espera null
    const optionalFields = ['phone_fixed', 'goal_vestibular', 'goal_course', 'goal_concurso'];
    
    optionalFields.forEach(field => {
      if (payload[field] === "") {
        payload[field] = null;
      }
    });

    // 3. Garante que campos de perfilamento não usados sejam NULL (necessário para a lógica condicional)
    if (formData.perfil === 'vestibular') {
        payload.goal_concurso = null;
    } else { // perfil === 'concurso'
        payload.goal_vestibular = null;
        payload.goal_course = null;
    }
    // --- FIM DA LIMPEZA ---
    
    // O campo 'state' será enviado com o nome correto ('state') e com um valor do Enum (nome completo do estado).

    try {
      const res = await axios.post(API_BASE_URL + "/cadastro", payload);
      setMessage("✅ Cadastro realizado com sucesso! Você será redirecionado para o Login.");
      
      // Redireciona para o login após um pequeno atraso
      setTimeout(() => navigate("/login"), 3000);
      
    } catch (err) {
      console.error("Erro detalhado do Backend:", err.response ? err.response.data : err);
      // O erro 422 é tratado aqui, mostrando a mensagem genérica
      setMessage("❌ Erro na operação. Verifique os dados (todos os campos são obrigatórios, exceto os de Fixo/Foco opcional) ou se o CPF/E-mail já existem.");
    }
  };

  return (
    <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
      <button className="btn-outline" onClick={() => navigate("/login")} style={{ width: 'auto', float: 'left', marginBottom: 20 }}>
        ⬅ Voltar
      </button>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', marginTop: '60px' }}>
        <h2 style={{ textAlign: 'center' }}>Novo Cadastro de Usuário</h2>
        {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Dados Pessoais */}
          <div className="grid-2">
            <input type="text" name="first_name" placeholder="Nome" value={formData.first_name} onChange={handleChange} required />
            <input type="text" name="last_name" placeholder="Sobrenome" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div className="grid-2">
            <select name="gender" onChange={handleChange} value={formData.gender} style={inputStyle}>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
            <input type="text" name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} required />
          </div>
          
          {/* Contato e Localização */}
          <div className="grid-2">
            {/* phone_fixed é opcional, mas enviamos "" que será convertido para null */}
            <input type="text" name="phone_fixed" placeholder="Fixo (Opcional)" value={formData.phone_fixed} onChange={handleChange} />
            <input type="text" name="phone_mobile" placeholder="Celular" value={formData.phone_mobile} onChange={handleChange} required />
          </div>
          <div className="grid-2">
            <input type="text" name="username" placeholder="Nome de Usuário (Nick)" value={formData.username} onChange={handleChange} required />
            
            {/* CORRIGIDO: Este campo DEVE ser 'state' e enviar o nome completo do estado para o Enum */}
            <select name="state" onChange={handleChange} value={formData.state} style={inputStyle} required>
                {estados.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                ))}
            </select>
          </div>
          
          {/* Credenciais */}
          <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Senha" value={formData.password} onChange={handleChange} required />

          {/* Foco de Estudo */}
          <h4 style={{marginTop: '20px'}}>Foco de Estudo (Opcional)</h4>
          <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
            <button type="button" onClick={() => setFormData({...formData, perfil: 'vestibular'})} style={formData.perfil === 'vestibular' ? btnActive : btnInactive}>Vestibular</button>
            <button type="button" onClick={() => setFormData({...formData, perfil: 'concurso'})} style={formData.perfil === 'concurso' ? btnActive : btnInactive}>Concurso</button>
          </div>

          {formData.perfil === 'vestibular' ? (
            <div className="grid-2">
              <input type="text" name="goal_vestibular" placeholder="Qual Vestibular?" value={formData.goal_vestibular} onChange={handleChange} />
              <input type="text" name="goal_course" placeholder="Qual Curso?" value={formData.goal_course} onChange={handleChange} />
            </div>
          ) : (
            <input type="text" name="goal_concurso" placeholder="Qual Concurso Almejado?" value={formData.goal_concurso} onChange={handleChange} />
          )}

          <button type="submit" className="btn-primary" style={{marginTop: '30px'}}>
            SALVAR CADASTRO
          </button>
        </form>
      </div>
    </div>
  );
}

export default Cadastro;