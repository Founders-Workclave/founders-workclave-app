import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    role: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}) => {
  return (
    <div className={styles.container}>
      {/* Search */}
      <div className={styles.searchWrapper}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search chat"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Conversations */}
      <div className={styles.conversationsList}>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`${styles.conversationItem} ${
              selectedConversationId === conversation.id ? styles.active : ""
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {conversation.participant.avatar ? (
                  <Image
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {conversation.participant.name.charAt(0)}
                  </div>
                )}
              </div>
              {conversation.participant.isOnline && (
                <div className={styles.onlineIndicator} />
              )}
            </div>

            <div className={styles.conversationContent}>
              <div className={styles.conversationHeader}>
                <h4 className={styles.participantName}>
                  {conversation.participant.name}
                </h4>
                <span className={styles.timestamp}>
                  {conversation.lastMessage.timestamp}
                </span>
              </div>
              <div className={styles.lastMessageRow}>
                <p className={styles.lastMessage}>
                  {conversation.lastMessage.text}
                </p>
                {conversation.unreadCount > 0 && (
                  <div className={styles.unreadBadge}>
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
