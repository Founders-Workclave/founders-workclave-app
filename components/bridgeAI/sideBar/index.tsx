"use client";

import { Conversation, ChatMode } from "@/types/bridge";
import Image from "next/image";
import styles from "./styles.module.css";
import { FileIcon, LightbulbIcon, Trash2Icon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeId: string | null;
  mode: ChatMode;
  isLoadingConversations: boolean;
  deletingId: string | null; // ✅ NEW
  onModeChange: (mode: ChatMode) => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void; // ✅ NEW
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  conversations,
  activeId,
  mode,
  isLoadingConversations,
  deletingId,
  onModeChange,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
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

      <div className={styles.modeSection}>
        <p className={styles.sectionLabel}>Mode</p>
        <div className={styles.modeTabs}>
          <button
            className={`${styles.modeTab} ${
              mode === "idea_refinement" ? styles.modeTabActive : ""
            }`}
            onClick={() => onModeChange("idea_refinement")}
          >
            <LightbulbIcon size={18} color="#5865F2" />
            <p className={styles.otherTexts}>Idea</p>
          </button>
          <button
            className={`${styles.modeTab} ${
              mode === "prd_generation" ? styles.modeTabActive : ""
            }`}
            onClick={() => onModeChange("prd_generation")}
          >
            <FileIcon size={18} color="#5865F2" />
            <p className={styles.otherTexts}>PRD</p>
          </button>
        </div>
      </div>

      <div className={styles.convList}>
        <p className={styles.sectionLabel}>Recent</p>

        {isLoadingConversations ? (
          <div className={styles.loadingConvs}>
            <svg
              className={styles.spinner}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
            <span>Loading conversations...</span>
          </div>
        ) : conversations.length === 0 ? (
          <p className={styles.emptyConvs}>No conversations yet</p>
        ) : (
          conversations.map((conv) => (
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

              {/* ✅ Delete Button */}
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                aria-label="Delete conversation"
                disabled={deletingId === conv.id}
              >
                {deletingId === conv.id ? (
                  <svg
                    className={styles.spinnerSmall}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        dur="0.8s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                ) : (
                  <Trash2Icon size={14} />
                )}
              </button>
            </button>
          ))
        )}
      </div>

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
