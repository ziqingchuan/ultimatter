import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BasicMode from './pages/BasicMode';
import CreativeMode from './pages/CreativeMode';
import Codex from './pages/Codex';
import { GameProvider } from './pages/GameContext';
import './styles/global.css';

export default function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/basic" element={<BasicMode />} />
          <Route path="/creative" element={<CreativeMode />} />
          <Route path="/codex" element={<Codex />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}
