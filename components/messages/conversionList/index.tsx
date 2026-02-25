"use client";
import React from "react";
import styles from "./styles.module.css";

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
    role: string;
    status?: "online" | "offline" | "away";
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
  isLoading?: boolean;
  onlineUsers?: Set<string>;
}

const ConversationSkeleton = () => (
  <div className={styles.conversationSkeleton}>
    <div className={styles.skeletonAvatar}></div>
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonName}></div>
        <div className={styles.skeletonTime}></div>
      </div>
      <div className={styles.skeletonMessage}></div>
    </div>
  </div>
);

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  isLoading = false,
  onlineUsers = new Set(),
}) => {
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp || timestamp === "Just now") return timestamp;
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

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
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Conversations */}
      <div className={styles.conversationsList}>
        {isLoading ? (
          <>
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
          </>
        ) : conversations.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={styles.emptyIcon}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className={styles.emptyText}>
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            <p className={styles.emptySubtext}>
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation to get started"}
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isSelected = selectedConversationId === conversation.id;
            const isOnline = onlineUsers.has(conversation.participant.id);

            return (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  isSelected ? styles.active : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className={styles.avatarWrapper}>
                  <div className={styles.avatar}>
                    {conversation.participant.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        width={40}
                        height={40}
                        className={styles.avatarImage}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {conversation.participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* ✅ Online dot from onlineUsers set only */}
                  {isOnline && <div className={styles.onlineIndicator} />}
                </div>

                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <div className={styles.nameAndRole}>
                      <h4 className={styles.participantName}>
                        {conversation.participant.name}
                      </h4>
                      {isOnline && (
                        <span className={styles.onlineText}>• Online</span>
                      )}
                    </div>
                    <span className={styles.timestamp}>
                      {formatTimestamp(conversation.lastMessage.timestamp)}
                    </span>
                  </div>

                  <div className={styles.lastMessageRow}>
                    <p
                      className={`${styles.lastMessage} ${
                        !conversation.lastMessage.isRead ? styles.unread : ""
                      }`}
                    >
                      {conversation.lastMessage.text}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className={styles.unreadBadge}>
                        {conversation.unreadCount > 99
                          ? "99+"
                          : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
