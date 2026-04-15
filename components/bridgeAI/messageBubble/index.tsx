import { Message } from "@/types/bridge";
import styles from "./styles.module.css";
import { BotIcon, User } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

function formatContent(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`${styles.row} ${isUser ? styles.rowUser : ""}`}>
      <div
        className={`${styles.avatar} ${
          isUser ? styles.avatarUser : styles.avatarAlex
        }`}
      >
        {isUser ? (
          <User size={18} color="#5865F2" />
        ) : (
          <BotIcon size={18} color="#ffffff" />
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.name}>{isUser ? "You" : "Bridge"}</p>
        <div
          className={`${styles.bubble} ${
            isUser ? styles.bubbleUser : styles.bubbleAlex
          }`}
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
        <p className={styles.time}>{time}</p>
      </div>
    </div>
  );
}
