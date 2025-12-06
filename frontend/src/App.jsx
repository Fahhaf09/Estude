import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz"; // <--- Importe o Quiz
import Ranking from "./pages/Ranking"; // <--- Importe aqui
import Upgrade from "./pages/Upgrade"; // <--- NOVO IMPORT
import AdminPanel from "./pages/AdminPanel"; // <--- NOVO IMPORT
import StudyArea from "./pages/StudyArea"; // <--- NOVO IMPORT

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Rota com o parâmetro dinâmico para a trilha */}
        <Route path="/quiz/:trilha" element={<Quiz />} /> 
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/upgrade" element={<Upgrade />} /> {/* <--- NOVA ROTA */}
        <Route path="/admin" element={<AdminPanel />} /> {/* <--- NOVA ROTA */}
        {/* Rota para a seleção de Áreas/Disciplinas */}
        <Route path="/study/:trilha" element={<StudyArea />} /> 
        {/* A rota do Quiz também será atualizada no PASSO 3 para receber mais filtros */}
        <Route path="/quiz/:trilha" element={<Quiz />} /> 
        {/* ... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;