"use client";
import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { useConversations } from "@/hooks/useConversation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getCurrentUserId } from "@/lib/api/getUserId";
import ConversationList from "./conversionList";
import ChatWindow from "./chatWindow";
import EmptyState from "./emptyState";

interface PageProps {
  params: { userId: string };
}

const MessagesPage = ({ params }: PageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const userId = params.userId || getCurrentUserId() || "";

  const {
    conversations,
    messages,
    isLoading,
    isFetchingPreviews,
    error,
    onlineUsers,
    fetchMessages,
    sendMessage,
    handleWebSocketMessage,
    markAsRead,
  } = useConversations({
    currentUserId: userId,
    autoFetch: true,
  });

  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket({
    conversationId: selectedConversationId,
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log("✅ Chat WebSocket connected"),
    onDisconnect: () => console.log("🔌 Chat WebSocket disconnected"),
    onError: (error) => console.error("❌ Chat WebSocket error:", error),
    autoConnect: true,
  });

  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        await fetchMessages(selectedConversationId);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
    markAsRead(selectedConversationId);
  }, [selectedConversationId, fetchMessages, markAsRead]);

  if (!userId) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBanner}>
          <p>Error: No user ID found. Please log in again.</p>
          <button onClick={() => (window.location.href = "/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.participant.name.toLowerCase().includes(searchLower) ||
      conv.participant.role.toLowerCase().includes(searchLower) ||
      conv.lastMessage.text.toLowerCase().includes(searchLower)
    );
  });

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  const isParticipantOnline = selectedConversation
    ? onlineUsers.has(selectedConversation.participant.id)
    : false;

  const participantWithCorrectStatus = selectedConversation
    ? {
        ...selectedConversation.participant,
        isOnline: isParticipantOnline,
        status: isParticipantOnline
          ? ("online" as const)
          : ("offline" as const),
      }
    : null;

  const handleSendMessage = async (text: string, replyToId?: string) => {
    if (!selectedConversationId) return;
    try {
      await sendMessage(selectedConversationId, text);
      sendWebSocketMessage({
        message: text,
        ...(replyToId && { reply_to: replyToId }),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.conversationListWrapper} ${
          selectedConversationId ? styles.hidden : ""
        }`}
      >
        <ConversationList
          conversations={filteredConversations}
          selectedConversationId={selectedConversationId || undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={setSelectedConversationId}
          isLoading={
            (isLoading && conversations.length === 0) || isFetchingPreviews
          }
          onlineUsers={onlineUsers}
        />
      </div>

      <div
        className={`${styles.chatWindowWrapper} ${
          !selectedConversationId ? styles.hidden : ""
        }`}
      >
        {selectedConversation && participantWithCorrectStatus ? (
          <ChatWindow
            participant={participantWithCorrectStatus}
            messages={messages[selectedConversationId!] || []}
            currentUserId={userId}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversationId(null)}
            isConnected={isConnected}
            isLoadingMessages={isLoadingMessages}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
