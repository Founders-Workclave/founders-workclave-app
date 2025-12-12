"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import SendMessage from "@/svgs/sendMessage";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  role: string;
}

interface ChatWindowProps {
  participant: Participant;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  participant,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}) => {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <div className={styles.participantInfo}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {participant.avatar ? (
                <Image
                  src={participant.avatar}
                  alt={participant.name}
                  width={40}
                  height={40}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {participant.name.charAt(0)}
                </div>
              )}
            </div>
            {participant.isOnline && <div className={styles.onlineIndicator} />}
          </div>
          <h3 className={styles.participantName}>{participant.name}</h3>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        <div className={styles.dateLabel}>
          {messages.length > 0 && formatDate(messages[0].timestamp)}
        </div>

        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          return (
            <div
              key={message.id}
              className={`${styles.messageWrapper} ${
                isCurrentUser
                  ? styles.messageWrapperSent
                  : styles.messageWrapperReceived
              }`}
            >
              <div
                className={`${styles.messageBubble} ${
                  isCurrentUser ? styles.messageSent : styles.messageReceived
                }`}
              >
                <p className={styles.messageText}>{message.text}</p>
                <span className={styles.messageTime}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.messageInput}
        />
        <button className={styles.emojiButton} aria-label="Add emoji">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>
        <button
          onClick={handleSend}
          disabled={!messageText.trim()}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <SendMessage />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
