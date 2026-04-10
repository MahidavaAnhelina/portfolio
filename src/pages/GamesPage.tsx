import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './GamesPage.module.css';

type Game = {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  highscoreKey: string;
  route: string;
};

const GAMES: Game[] = [
  {
    id: 'snake',
    title: 'Snake',
    desc: 'Classic snake on a 20×20 grid. Arrows or WASD on desktop, swipe on mobile. Eat, grow, don\'t bite yourself.',
    emoji: '🐍',
    highscoreKey: 'snake:highscore',
    route: '/games/snake',
  },
];

function GameCard({ game }: { game: Game }) {
  const [highscore] = useLocalStorage<number>(game.highscoreKey, 0);
  return (
    <div className={styles.card}>
      <div className={styles.preview}>{game.emoji}</div>
      <div>
        <div className={styles.cardTitle}>{game.title}</div>
        <div className={styles.cardDesc}>{game.desc}</div>
      </div>
      <div className={styles.stats}>
        <span className={styles.statLabel}>Best score</span>
        <span className={styles.statValue}>{highscore}</span>
      </div>
      <Link to={game.route} className={styles.playButton}>
        ▶ Play
      </Link>
    </div>
  );
}

export default function GamesPage() {
  useDocumentTitle('Mini games · Anhelina Mahidava');
  return (
    <div className={styles.page}>
      <div className={styles.backBar}>
        <Link to="/" className={styles.back}>
          ← Home
        </Link>
      </div>

      <div className={styles.header}>
        <div className={styles.title}>Mini games</div>
        <div className={styles.subtitle}>Little breaks between pull requests.</div>
      </div>

      <div className={styles.grid}>
        {GAMES.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </div>
  );
}
