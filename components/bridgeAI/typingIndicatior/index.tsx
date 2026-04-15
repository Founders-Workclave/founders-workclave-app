import { BotIcon } from "lucide-react";
import styles from "./styles.module.css";

export default function TypingIndicator() {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>
        <BotIcon color="#ffffff" size={16} />
      </div>
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
