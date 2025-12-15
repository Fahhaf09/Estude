import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro"; 
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Ranking from "./pages/Ranking";
import Upgrade from "./pages/Upgrade";
import AdminPanel from "./pages/AdminPanel";
import StudyArea from "./pages/StudyArea"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PRINCIPAIS (Não dinâmicas) */}
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* ROTAS DINÂMICAS (Com parâmetros) */}
        {/* Rota para a área de estudo com parâmetro da trilha (ex: /study/VESTIBULAR) */}
        <Route path="/study/:trilha" element={<StudyArea />} /> 
        
        {/* Rota do Quiz com o parâmetro da trilha */}
        <Route path="/quiz/:trilha" element={<Quiz />} /> 
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;