"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import styles from "./styles.module.css";
import SendMessage from "@/svgs/sendMessage";
import MessageSkeleton from "../messageSkeleton";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isDelivered?: boolean;
  senderName?: string;
  replyToId?: string | null;
  replyToMessage?: Message | null;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  role: string;
  status?: "online" | "offline" | "away";
}

interface ChatWindowProps {
  participant: Participant;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string, replyToId?: string) => void;
  onBack?: () => void;
  isConnected?: boolean;
  isLoadingMessages?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  participant,
  messages: rawMessages,
  currentUserId,
  onSendMessage,
  onBack,
  isConnected = false,
  isLoadingMessages = false,
}) => {
  const [messageText, setMessageText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();

    notificationSound.current = {
      play: () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        return Promise.resolve();
      },
    } as HTMLAudioElement;
  }, []);

  useEffect(() => {
    if (rawMessages.length > 0) {
      const lastMessage = rawMessages[rawMessages.length - 1];
      if (lastMessage.senderId !== currentUserId) {
      }
    }
  }, [rawMessages, currentUserId]);

  const messages = useMemo(
    () =>
      rawMessages.map((msg) => ({
        ...msg,
        replyToMessage: msg.replyToId
          ? rawMessages.find((m) => m.id === msg.replyToId) || null
          : null,
      })),
    [rawMessages]
  );

  const validMessages = useMemo(
    () => messages.filter((msg) => msg.text && msg.text.trim() !== ""),
    [messages]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to close search and reset all search state
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setCurrentSearchIndex(0);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  const scrollToMessage = useCallback(
    (messageIndex: number) => {
      const message = validMessages[messageIndex];
      if (!message) return;
      const messageEl = messageRefs.current.get(message.id);
      if (messageEl) {
        messageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [validMessages]
  );

  useEffect(() => {
    const runSearch = () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setCurrentSearchIndex(0);
        return;
      }

      const query = searchQuery.toLowerCase();
      const results: number[] = [];

      validMessages.forEach((message, index) => {
        if (message.text.toLowerCase().includes(query)) {
          results.push(index);
        }
      });

      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);

      if (results.length > 0) {
        scrollToMessage(results[0]);
      }
    };

    setTimeout(runSearch, 0);
  }, [searchQuery, validMessages, scrollToMessage]);

  const handleNextResult = () => {
    if (searchResults.length === 0) return;
    const next = (currentSearchIndex + 1) % searchResults.length;
    setCurrentSearchIndex(next);
    scrollToMessage(searchResults[next]);
  };

  const handlePrevResult = () => {
    if (searchResults.length === 0) return;
    const prev =
      (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentSearchIndex(prev);
    scrollToMessage(searchResults[prev]);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNextResult();
    }
    if (e.key === "Escape") {
      closeSearch();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className={styles.highlight}>
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const handleSend = () => {
    if (messageText.trim() && isConnected) {
      onSendMessage(messageText.trim(), replyingTo?.id);
      setMessageText("");
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setTimeout(() => {
      document
        .querySelector<HTMLInputElement>(`.${styles.messageInput}`)
        ?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "Today";
      const today = new Date();
      if (date.toDateString() === today.toDateString()) return "Today";
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Today";
    }
  };

  const isParticipantOnline =
    participant.isOnline || participant.status === "online";

  const isMessageSending = (messageId: string) => messageId.startsWith("temp_");

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
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
            </button>
          )}
          <div className={styles.participantInfo}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar}>
                {participant.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
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
              {isParticipantOnline && (
                <div className={styles.onlineIndicator} />
              )}
            </div>
            <div className={styles.participantDetails}>
              <h3 className={styles.participantName}>{participant.name}</h3>
              <div className={styles.connectionStatus}>
                <span
                  className={`${styles.connectionDot} ${
                    isParticipantOnline ? styles.connected : styles.disconnected
                  }`}
                />
                <span className={styles.connectionText}>
                  {isParticipantOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className={styles.headerActions}>
          <button
            className={`${styles.searchToggleBtn} ${
              isSearchOpen ? styles.searchToggleBtnActive : ""
            }`}
            onClick={isSearchOpen ? closeSearch : openSearch}
            title="Search messages"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.searchBarIcon}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              className={styles.searchBarInput}
            />
            {searchQuery && (
              <span className={styles.searchCount}>
                {searchResults.length > 0
                  ? `${currentSearchIndex + 1} of ${searchResults.length}`
                  : "No results"}
              </span>
            )}
          </div>

          <div className={styles.searchNavigation}>
            <button
              className={styles.searchNavBtn}
              onClick={handlePrevResult}
              disabled={searchResults.length === 0}
              title="Previous result"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className={styles.searchNavBtn}
              onClick={handleNextResult}
              disabled={searchResults.length === 0}
              title="Next result"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <button
              className={styles.searchCloseBtn}
              onClick={closeSearch}
              title="Close search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        {isLoadingMessages ? (
          <MessageSkeleton />
        ) : validMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {validMessages.length > 0 && (
              <div className={styles.dateLabel}>
                {formatDate(validMessages[0].timestamp)}
              </div>
            )}

            {validMessages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const messageTime = formatTime(message.timestamp);
              const isSending = isMessageSending(message.id);
              const isSearchResult = searchResults.includes(index);
              const isActiveResult =
                searchResults[currentSearchIndex] === index;

              return (
                <div
                  key={message.id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(message.id, el);
                    else messageRefs.current.delete(message.id);
                  }}
                  className={`${styles.messageWrapper} ${
                    isCurrentUser
                      ? styles.messageWrapperSent
                      : styles.messageWrapperReceived
                  } ${isActiveResult ? styles.activeSearchResult : ""}`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      isCurrentUser
                        ? styles.messageSent
                        : styles.messageReceived
                    } ${isSending ? styles.messageSending : ""}
                    ${isSearchResult ? styles.searchResultBubble : ""}
                    ${isActiveResult ? styles.activeSearchBubble : ""}`}
                  >
                    {!isCurrentUser && message.senderName && (
                      <div className={styles.senderName}>
                        {message.senderName}
                      </div>
                    )}

                    {/* Reply Preview */}
                    {message.replyToMessage && (
                      <div className={styles.replyPreview}>
                        <div className={styles.replyBar}></div>
                        <div className={styles.replyContent}>
                          <div className={styles.replyAuthor}>
                            {message.replyToMessage.senderName || "Unknown"}
                          </div>
                          <div className={styles.replyText}>
                            {message.replyToMessage.text}
                          </div>
                        </div>
                      </div>
                    )}

                    <p className={styles.messageText}>
                      {isSearchOpen && searchQuery
                        ? highlightText(message.text, searchQuery)
                        : message.text}
                    </p>

                    <div className={styles.messageFooter}>
                      {messageTime && (
                        <span className={styles.messageTime}>
                          {messageTime}
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className={styles.messageStatus}>
                          {isSending ? (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              className={styles.sendingIcon}
                            >
                              <circle
                                cx="7"
                                cy="7"
                                r="6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                opacity="0.5"
                              />
                              <path
                                d="M7 3.5V7L9.5 9.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                opacity="0.5"
                              />
                            </svg>
                          ) : message.isRead ? (
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                            >
                              <path
                                d="M1 7L5 11L11 3"
                                stroke="#4CAF50"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7 7L11 11L17 3"
                                stroke="#4CAF50"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : message.isDelivered ? (
                            <svg
                              width="18"
                              height="14"
                              viewBox="0 0 18 14"
                              fill="none"
                            >
                              <path
                                d="M1 7L5 11L11 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.6"
                              />
                              <path
                                d="M7 7L11 11L17 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.6"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                            >
                              <path
                                d="M2 7L6 11L12 3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.5"
                              />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Reply Button */}
                    <button
                      className={styles.replyButton}
                      onClick={() => handleReply(message)}
                      title="Reply to this message"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 10L4 15L9 20" />
                        <path d="M20 4v7a4 4 0 01-4 4H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Bar */}
      {replyingTo && (
        <div className={styles.replyBar}>
          <div className={styles.replyBarContent}>
            <div className={styles.replyBarStripe}></div>
            <div className={styles.replyBarText}>
              <div className={styles.replyBarAuthor}>
                Replying to {replyingTo.senderName || "Unknown"}
              </div>
              <div className={styles.replyBarMessage}>{replyingTo.text}</div>
            </div>
          </div>
          <button
            className={styles.replyBarCancel}
            onClick={cancelReply}
            title="Cancel reply"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder={
            isConnected ? "Type a message..." : "Connecting to chat..."
          }
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className={styles.messageInput}
          disabled={!isConnected}
        />
        <button
          className={styles.emojiButton}
          aria-label="Add emoji"
          disabled={!isConnected}
        >
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
          disabled={!messageText.trim() || !isConnected}
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
