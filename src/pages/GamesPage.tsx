import { Link } from 'react-router-dom';

export default function GamesPage() {
  return (
    <div className="page-placeholder">
      <h1>Mini games</h1>
      <p>Games list goes here in Phase 3.</p>
      <nav>
        <Link to="/">← Home</Link>
        <Link to="/games/snake">Snake →</Link>
      </nav>
    </div>
  );
}
