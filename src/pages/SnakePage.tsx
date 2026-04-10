import { Link } from 'react-router-dom';

export default function SnakePage() {
  return (
    <div className="page-placeholder">
      <h1>Snake 🐍</h1>
      <p>Hang tight — the playable game lands in Phase 4.</p>
      <nav>
        <Link to="/games">← Games</Link>
      </nav>
    </div>
  );
}
