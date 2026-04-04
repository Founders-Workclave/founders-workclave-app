"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./styles.module.css";
import { useConversations } from "@/hooks/useConversation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getCurrentUserId } from "@/lib/api/getUserId";
import { getAuthToken } from "@/lib/api/auth";
import ConversationList from "./conversionList";
import ChatWindow from "./chatWindow";
import EmptyState from "./emptyState";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

interface PageProps {
  params: { userId: string };
}

const MessagesPage = ({ params }: PageProps) => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(() => searchParams.get("conversationId"));
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const userId = params.userId || getCurrentUserId() || "";

  const {
    conversations,
    messages,
    isLoading,
    isFetchingPreviews,
    onlineUsers,
    fetchMessages,
    sendMessage,
    handleWebSocketMessage,
    markAsRead,
    markMessageDeleted,
  } = useConversations({
    currentUserId: userId,
    autoFetch: true,
  });

  // ── handleDeleteMessage must be before the early return ──
  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      // 1. Optimistic update — sender sees it instantly
      markMessageDeleted(messageId);

      try {
        // 2. REST API
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/chat/delete-message/${messageId}/`,
          {
            method: "DELETE",
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          // Rollback on failure
          if (selectedConversationId) {
            await fetchMessages(selectedConversationId);
          }
          return;
        }

        sendWSRef.current?.({
          type: "message_deleted",
          message_id: messageId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      } catch (error) {
        console.error("Failed to delete message:", error);
        if (selectedConversationId) {
          await fetchMessages(selectedConversationId);
        }
      }
    },
    [markMessageDeleted, fetchMessages, selectedConversationId]
  );

  const sendWSRef = React.useRef<((data: unknown) => void) | null>(null);

  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket({
    conversationId: selectedConversationId,
    onMessage: handleWebSocketMessage,
    onConnect: () => {},
    onDisconnect: () => {},
    onError: (error) => console.error("❌ Chat WebSocket error:", error),
    autoConnect: true,
  });

  sendWSRef.current = sendWebSocketMessage as unknown as (
    data: unknown
  ) => void;

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

  // ── Early return AFTER all hooks ──
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
            onDeleteMessage={handleDeleteMessage}
            onBack={() => setSelectedConversationId(null)}
            isConnected={isConnected}
            isLoadingMessages={isLoadingMessages}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
