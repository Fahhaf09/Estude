import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
const API_BASE_URL = "https://estude.onrender.com";

function Upgrade() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    
    let user;
    if (storedUser) {
        user = JSON.parse(storedUser);
    } else {
        navigate("/");
        return null;
    }

    const handleUpgrade = async () => {
        if (user.subscription_tier === 'PREMIUM') {
            alert("Você já é Premium!");
            navigate("/dashboard");
            return;
        }

        // --- SIMULAÇÃO DE INTEGRAÇÃO DE PAGAMENTO ---
        alert("Simulando processamento do Stripe/PayPal... Pagamento APROVADO!");

        try {
            // MUDANÇA AQUI: Usa API_BASE_URL para a rota de subscribe
            const res = await axios.post(`${API_BASE_URL}/subscribe/${user.user_id}`);
            
            if (res.data.status === 'success') {
                // Atualiza o objeto local (CRUCIAL para a Dashboard)
                const updatedUser = { ...user, subscription_tier: 'PREMIUM' };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                alert(res.data.message + " Acesso ilimitado liberado!");
                navigate("/dashboard");
            }
        } catch (err) {
            alert("Erro ao atualizar o status Premium no servidor.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: 500, textAlign: 'center' }}>
            <button className="btn-outline" onClick={() => navigate("/dashboard")} style={{ width: 'auto', float: 'left' }}>
                ⬅ Voltar
            </button>
            
            <h1 style={{ marginTop: 40 }}>
            👑Desbloqueie o PREMIUM</h1>
            <p style={{ color: '#666' }}>
            Maximize seu aprendizado com acesso total aos recursos mais inteligentes da plataforma.</p>

            {/* Cartão do Plano PREMIUM */}
            <div className="card" style={{ border: '3px solid #FFD700', marginTop: 30 }}>
                <h2 style={{ color: '#FFD700' }}>Plano Estudante PRO</h2>
                <h1 style={{ marginBottom: 5 }}>R$ 19,90 / mês</h1>
                
                <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left', lineHeight: 2.0 }}>
                    <li>✅ Acesso Ilimitado a todas as Questões.</li>
                    <li>✅ **Professor Aqeel** para te auxiliar nos estudos.</li>
                    <li>✅ Acompanhamento de Dificuldade ELO Detalhado.</li>
                    <li>✅ Suporte Prioritário.</li>
                </ul>
                
                <button 
                    className="btn-success" 
                    onClick={handleUpgrade}
                    disabled={user.subscription_tier === 'PREMIUM'}
                >
                    {user.subscription_tier === 'PREMIUM' ? 'ATIVO' : 'ASSINAR AGORA'}
                </button>
            </div>
            
            <p style={{ marginTop: 20, fontSize: 14, color: '#999' }}>
                *Sua assinatura pode ser cancelada a qualquer momento.
            </p>
        </div>
    );
}

export default Upgrade;