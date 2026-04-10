import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import SnakePage from './pages/SnakePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/snake" element={<SnakePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
