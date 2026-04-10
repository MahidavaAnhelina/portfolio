import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page-placeholder">
      <h1>Home</h1>
      <p>Phase 1 bootstrap — the 3D portfolio will land here in Phase 2.</p>
      <nav>
        <Link to="/games">Mini games →</Link>
      </nav>
    </div>
  );
}
