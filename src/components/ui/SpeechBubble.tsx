import styles from './SpeechBubble.module.css';

type Props = {
  text: string;
  visible: boolean;
};

export default function SpeechBubble({ text, visible }: Props) {
  return (
    <div
      className={`${styles.speech} ${visible ? styles.show : ''}`}
      style={{
        left: `calc(50% - 100px)`,
        top: `calc(50% - 200px)`,
      }}
    >
      {text || 'Hello! 👋'}
    </div>
  );
}
