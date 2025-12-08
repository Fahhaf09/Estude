import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 🌐 URL de Produção (Modifique após o deploy do Backend)
// Em produção, isso deve ser "https://seubackend.render.com"
const API_BASE_URL = "https://estude.onrender.com"; 

// --- DADOS E MOCKUP DE ANÚNCIO (Simulação de Conteúdo Dinâmico) ---
const ANUNCIOS = [
    "📢 Edital ENEM 2026: Inscrições abertas até 30/11!",
    "⭐ Novo Simulado de Ciências da Natureza disponível!",
    "👑 Usuários PREMIUM: Acesso exclusivo ao Laboratório de IA!",
];

function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [trilhaSelecionada, setTrilhaSelecionada] = useState('VESTIBULAR');
    
    // Simula o índice do anúncio que está sendo exibido
    const [anuncioIndex, setAnuncioIndex] = useState(0); 

    // Lógica para alternar o anúncio a cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setAnuncioIndex(prevIndex => (prevIndex + 1) % ANUNCIOS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // --- LÓGICA DE CARREGAMENTO DE DADOS ---
    useEffect(() => {
        const storedData = localStorage.getItem("user");
        if (!storedData) { return navigate("/"); }
        
        let parsedData;
        let userId;
        try {
            parsedData = JSON.parse(storedData);
            userId = parsedData.user_id;
        } catch(e) {
            localStorage.clear();
            return navigate("/");
        }

        if (!userId) {
            localStorage.clear();
            return navigate("/");
        }

        // MUDANÇA AQUI: Usa API_BASE_URL
        axios.get(API_BASE_URL + `/usuarios/${userId}`) 
          .then(res => {
            setUser(res.data);
          })
          .catch(() => {
              localStorage.clear();
              navigate("/");
          });
    }, [navigate]);

    if (!user) return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Carregando...</div>;
    
    // Define a cor de destaque com base no plano
    const premiumColor = user.subscription_tier === 'PREMIUM' ? '#FFD700' : '#6C63FF';

    // --- RENDERIZAÇÃO DA INTERFACE MODERNA ---
    return (
        <>
            {/* ---------------------------------------------------- */}
            {/* 1. HEADER FIXO E MINIMALISTA (TOPO DA PLATAFORMA) */}
            {/* ---------------------------------------------------- */}
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '15px 30px', backgroundColor: '#1f2937', color: 'white', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10
            }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: premiumColor }}>
                    🧠 PLATAFORMA ELO
                </h2>

                <nav style={{ display: 'flex', gap: '20px' }}>
                    <a href="#" onClick={() => navigate("/ranking")} style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                        🏆 Desempenho
                    </a>
                    <a href="#" onClick={() => navigate(`/study/${trilhaSelecionada}`)} style={{ color: 'white', textDecoration: 'none', fontWeight: 500 }}>
                        📚 Questões
                    </a>
                    <a href="#" onClick={() => navigate("/upgrade")} style={{ color: premiumColor, textDecoration: 'none', fontWeight: 700 }}>
                        {user.subscription_tier === 'PREMIUM' ? '👑 Assinante PRO' : 'UPGRADE'}
                    </a>
                    <a href="#" onClick={() => { localStorage.clear(); navigate("/"); }} style={{ color: '#ff5252', textDecoration: 'none', fontWeight: 500 }}>
                        Sair
                    </a>
                </nav>
            </header>

            {/* ---------------------------------------------------- */}
            {/* 2. CONTEÚDO PRINCIPAL (MÓDULOS) */}
            {/* ---------------------------------------------------- */}
            <div className="container" style={{ paddingTop: 30, maxWidth: 1000 }}>
                
                {/* --- MÓDULO DE ANÚNCIOS / EDITais (TOPO DA ÁREA DE CONTEÚDO) --- */}
                <div style={{ 
                    padding: '20px', marginBottom: '30px', borderRadius: '12px', 
                    backgroundColor: '#e0f7fa', color: '#006064', textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <strong>EDITAIS & INFORMAÇÕES:</strong> {ANUNCIOS[anuncioIndex]}
                </div>

                {/* --- MÓDULO DE PERFIL E STATUS --- */}
                <div className="grid-2">
                    {/* CARTÃO DE METRICAS PRINCIPAIS */}
                    <div className="card" style={{ padding: 25, borderLeft: `5px solid ${premiumColor}` }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                            STATUS ATUAL: <span style={{ color: premiumColor, fontWeight: 'bold' }}>{user.subscription_tier}</span>
                        </p>
                        <h1 style={{ marginTop: 5, marginBottom: 10 }}>Olá, {user.username} 👋</h1>
                        
                        <div style={{ display: 'flex', gap: 20, marginTop: 15 }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{user.level}</div>
                            <div>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>Nível de Estudo</p>
                                <small>{Math.round(user.xp)} XP acumulados.</small>
                            </div>
                        </div>

                        {user.subscription_tier === 'FREE' && (
                            <div style={{ marginTop: 15, padding: 10, backgroundColor: '#fbe9e7', borderRadius: 8 }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#bf360c' }}>
                                    Limite diário: {5 - (user.daily_questions_count || 0)} questões restantes.
                                </p>
                            </div>
                        )}
                        <p style={{ margin: '15px 0 0', fontSize: '0.8rem', textAlign: 'right' }}>
                            <a href="#" onClick={() => navigate("/admin")} style={{ color: '#007BFF', textDecoration: 'none' }}>
                                Acesso Admin
                            </a>
                        </p>
                    </div>

                    {/* CARTÃO DE MEDALHAS / RECURSOS */}
                    <div className="card" style={{ padding: 25 }}>
                        <h3>🏅 Conquistas Recentes</h3>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', minHeight: '50px' }}>
                            {user.badges && user.badges.length > 0 ? (
                                user.badges.map((b, i) => (
                                    <span key={i} style={{ fontSize: '2rem' }} title={b.name}>{b.icon}</span>
                                ))
                            ) : (
                                <p style={{ color: '#999', fontSize: '0.9rem' }}>Jogue para desbloquear sua primeira medalha!</p>
                            )}
                        </div>
                        <hr style={{ borderTop: '1px solid #eee', margin: '15px 0' }} />
                        <h3>📊 Ver Desempenho</h3>
                        <button className="btn-outline" onClick={() => navigate("/ranking")}>
                            Ranking Nacional e Estadual
                        </button>
                    </div>
                </div>


                {/* --- MÓDULO DE SELEÇÃO DE TRILHA (ESTUDO PRODUTIVO) --- */}
                <h2 style={{ marginTop: 40 }}>🎯 Início Rápido</h2>
                <div className="card">
                    <h3>📚 1. Escolha a Trilha de Estudo</h3>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                        {['VESTIBULAR', 'CONCURSO'].map(trilha => (
                            <button 
                                key={trilha}
                                onClick={() => setTrilhaSelecionada(trilha)}
                                className={trilhaSelecionada === trilha ? "btn-primary" : "btn-outline"}
                                style={{ flex: 1 }}
                            >
                                {trilha}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        className="btn-success" 
                        // Navega para a área de estudo para seleção de conteúdo (StudyArea.jsx)
                        onClick={() => navigate(`/study/${trilhaSelecionada}`)} 
                        style={{ marginTop: 15 }}
                    >
                        CONTINUAR PARA {trilhaSelecionada}
                    </button>
                </div>
                
            </div>
        </>
    );
}
export default Dashboard;