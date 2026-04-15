"use client";

import BridgeAI from "@/svgs/bridgeAi";
import styles from "./styles.module.css";

interface TopbarProps {
  hasConversation: boolean;
  isGeneratingPRD: boolean;
  onGeneratePRD: () => void;
  onClearChat: () => void;
  onMenuToggle: () => void;
}

export default function Topbar({
  hasConversation,
  isGeneratingPRD,
  onGeneratePRD,
  onClearChat,
  onMenuToggle,
}: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label="Open menu"
          type="button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className={styles.agentInfo}>
          <div className={styles.agentAvatar}>
            <BridgeAI />
            <span className={styles.onlineDot} />
          </div>
          <div>
            <p className={styles.agentName}>Bridge AI</p>
            <p className={styles.agentTitle}>
              Principal PM · 15 years exp · FoundersWorkclave
            </p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.prdBtn} ${
            !hasConversation || isGeneratingPRD ? styles.prdBtnDisabled : ""
          }`}
          onClick={onGeneratePRD}
          disabled={!hasConversation || isGeneratingPRD}
          title="Generate PRD from conversation"
          type="button"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <span className={styles.prdBtnLabel}>
            {isGeneratingPRD ? "Generating…" : "Generate PRD"}
          </span>
        </button>

        <button
          className={styles.iconBtn}
          onClick={onClearChat}
          title="Clear conversation"
          type="button"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </header>
  );
}
