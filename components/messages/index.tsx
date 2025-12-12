"use client";
import React, { useState, useCallback } from "react";
import messagesData from "@/mocks/messages.json";
import useWebSocket from "@/hooks/useWebSocket";
import styles from "./styles.module.css";
import type { Conversation } from "./conversionList";
import type { Message } from "./chatWindow";
import type { WebSocketMessage } from "@/types/websocket";
import ConversationList from "./conversionList";
import ChatWindow from "./chatWindow";
import EmptyState from "./emptyState";

interface PageProps {
  params: {
    userId: string;
  };
}

const MessagesPage = ({ params }: PageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>(
    messagesData.conversations as Conversation[]
  );
  const [messages, setMessages] = useState<Record<string, Message[]>>(
    messagesData.messages as Record<string, Message[]>
  );

  // WebSocket connection with proper generic type
  const { sendMessage: sendWebSocketMessage } = useWebSocket<Message>({
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
    userId: params.userId,
    onMessage: useCallback((wsMessage: WebSocketMessage<Message>) => {
      // Handle incoming WebSocket messages
      if (wsMessage.type === "message" && wsMessage.conversationId) {
        const newMessage: Message = wsMessage.data;
        setMessages((prev) => ({
          ...prev,
          [wsMessage.conversationId!]: [
            ...(prev[wsMessage.conversationId!] || []),
            newMessage,
          ],
        }));

        // Update conversation list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === wsMessage.conversationId
              ? {
                  ...conv,
                  lastMessage: {
                    text: newMessage.text,
                    timestamp: "Just now",
                    isRead: false,
                  },
                  unreadCount: conv.unreadCount + 1,
                }
              : conv
          )
        );
      }
    }, []),
  });

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.participant.name.toLowerCase().includes(searchLower) ||
      conv.lastMessage.text.toLowerCase().includes(searchLower)
    );
  });

  // Get selected conversation
  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  );

  // Handle sending message
  const handleSendMessage = (text: string) => {
    if (!selectedConversationId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: messagesData.currentUser.id,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Update local state
    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [
        ...(prev[selectedConversationId] || []),
        newMessage,
      ],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: {
                text: newMessage.text,
                timestamp: "Just now",
                isRead: true,
              },
            }
          : conv
      )
    );

    // Send via WebSocket with proper structure
    sendWebSocketMessage({
      type: "message",
      data: newMessage,
      conversationId: selectedConversationId,
    });
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
        />
      </div>

      <div
        className={`${styles.chatWindowWrapper} ${
          !selectedConversationId ? styles.hidden : ""
        }`}
      >
        {selectedConversation ? (
          <ChatWindow
            participant={selectedConversation.participant}
            messages={messages[selectedConversationId!] || []}
            currentUserId={messagesData.currentUser.id}
            onSendMessage={handleSendMessage}
            onBack={() => setSelectedConversationId(null)}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
