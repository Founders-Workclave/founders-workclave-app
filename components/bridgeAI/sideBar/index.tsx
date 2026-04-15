"use client";

import { Conversation, ChatMode } from "@/types/bridge";
import Image from "next/image";
import styles from "./styles.module.css";
import { FileIcon, LightbulbIcon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeId: string | null;
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  conversations,
  activeId,
  mode,
  onModeChange,
  onNewChat,
  onSelectConversation,
  onClose,
}: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <Image src="/assets/logo.png" width={107} height={32} alt="logo" />
        </div>

        <div className={styles.headerActions}>
          <button className={styles.newChatBtn} onClick={onNewChat}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New conversation
          </button>

          {/* Close button — mobile only */}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close sidebar"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mode */}
      <div className={styles.modeSection}>
        <p className={styles.sectionLabel}>Mode</p>
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${
              mode === "idea_refinement" ? styles.modeTabActive : ""
            }`}
            onClick={() => onModeChange("idea_refinement")}
          >
            <LightbulbIcon
              size={18}
              color={mode === "idea_refinement" ? "#5865F2" : "#5865F2"}
            />{" "}
            <p className={styles.otherTexts}>Idea</p>
          </button>
          <button
            className={`${styles.modeTab} ${
              mode === "prd_generation" ? styles.modeTabActive : ""
            }`}
            onClick={() => onModeChange("prd_generation")}
          >
            <FileIcon
              size={18}
              color={mode === "prd_generation" ? "#5865F2" : "#5865F2"}
            />{" "}
            <p className={styles.otherTexts}>PRD</p>
          </button>
        </div>
      </div>

      {/* Conversations */}
      <div className={styles.convList}>
        <p className={styles.sectionLabel}>Recent</p>
        {conversations.length === 0 && (
          <p className={styles.emptyConvs}>No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className={`${styles.convItem} ${
              activeId === conv.id ? styles.convItemActive : ""
            }`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span
              className={`${styles.convDot} ${
                conv.mode === "idea_refinement"
                  ? styles.convDotIdea
                  : styles.convDotPrd
              }`}
            />
            <span className={styles.convTitle}>{conv.title}</span>
            <span className={styles.convTime}>
              {conv.createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userAvatar}>FW</div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>Founder</p>
          <p className={styles.userRole}>Idea Stage</p>
        </div>
      </div>
    </aside>
  );
}
