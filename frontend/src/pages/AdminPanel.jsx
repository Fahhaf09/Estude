import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
const API_BASE_URL = "https://estude.onrender.com";

const initialFormState = {
   subject: "Matemática",
   topic: "",
   content_text: "",
   difficulty_level: 1000.0,
   correct_option: "",
    // Note: Adicione o campo area_tag e coloque um valor inicial se ele não estiver no seu estado inicial real
   track_tag: "VESTIBULAR",
    area_tag: "Matemática e suas Tecnologias" 
};

function AdminPanel() {
   const [form, setForm] = useState(initialFormState);
   const [message, setMessage] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setMessage(''); // Limpa a mensagem ao digitar
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Verificação simples dos campos
      if (!form.content_text || !form.correct_option) {
         setMessage("Preencha o Texto e a Opção Correta.");
         return;
      }

      try {
         const payload = {
            ...form,
            difficulty_level: parseFloat(form.difficulty_level), // Garante que é número
                // Note: Você pode precisar adicionar a area_tag no payload aqui se ela for um campo de entrada
                // Por simplicidade, assumimos que ela está no form:
                area_tag: form.area_tag || "Geral" 
         };

         // MUDANÇA AQUI: Usa API_BASE_URL para a rota de adicionar questão
         const res = await axios.post(API_BASE_URL + "/admin/add_question", payload);
         
         setMessage(`✅ Questão ID ${res.data.id} adicionada com sucesso!`);
         setForm(initialFormState); // Limpa o formulário após o sucesso

      } catch (err) {
         setMessage("❌ Erro ao adicionar questão. Verifique o servidor.");
         console.error(err);
      }
   };

   return (
      <div className="container" style={{ maxWidth: 700 }}>
         <button className="btn-outline" onClick={() => navigate("/dashboard")} style={{ width: 'auto', float: 'left', marginBottom: 20 }}>
            ⬅ Voltar
         </button>
         
         <h1 style={{ marginTop: 40 }}>⚙️ Painel de Administração</h1>
         <p>Adicione novas questões ao banco de dados.</p>

         <form onSubmit={handleSubmit} className="card">
            
            {/* Status Message */}
            {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}

            {/* Linha 1: Assunto e Trilha */}
            <div className="grid-2">
               <select name="subject" value={form.subject} onChange={handleChange} style={{ height: 40 }}>
                  <option value="Matemática">Matemática</option>
                  <option value="História">História</option>
                  <option value="Física">Física</option>
               </select>

               <select name="track_tag" value={form.track_tag} onChange={handleChange} style={{ height: 40 }}>
                  <option value="VESTIBULAR">VESTIBULAR</option>
                  <option value="CONCURSO">CONCURSO</option>
                  <option value="GERAL">GERAL</option>
               </select>
            </div>
                
                {/* Nota: Adicione a seleção de area_tag (Área de Conhecimento) aqui,
                   ou ela será enviada como o valor padrão do estado. */}
                <input 
               type="text" 
               name="area_tag" 
               placeholder="Área (Ex: Ciências da Natureza)" 
               value={form.area_tag || ''} 
               onChange={handleChange} 
            />

            {/* Linha 2: Tópico e Dificuldade */}
            <div className="grid-2">
               <input type="text" name="topic" placeholder="Tópico (ex: Geometria, Brasil Império)" value={form.topic} onChange={handleChange} />
               <input type="number" name="difficulty_level" placeholder="Dificuldade ELO (ex: 1000)" value={form.difficulty_level} onChange={handleChange} />
            </div>
            
            {/* Linha 3: Texto da Questão */}
            <textarea 
               name="content_text" 
               placeholder="Texto completo da questão"
               rows="4" 
               value={form.content_text} 
               onChange={handleChange}
               style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 8, marginTop: 10 }}
            />

            {/* Linha 4: Resposta Correta */}
            <input 
               type="text" 
               name="correct_option" 
               placeholder="Resposta Correta (Ex: 25cm²)" 
               value={form.correct_option} 
               onChange={handleChange} 
            />

            <button type="submit" className="btn-primary">
               ADICIONAR QUESTÃO AO BANCO
            </button>
         </form>
         
      </div>
   );
}

export default AdminPanel;