"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import chatService from "@/lib/api/chatService/chatService";
import {
  Conversation,
  Message,
  mapWebSocketMessageToComponent,
} from "@/types/chat";
import type { WebSocketMessage, WebSocketChatMessage } from "@/types/chat";
import toast from "react-hot-toast";

interface UseConversationsProps {
  currentUserId: string;
  autoFetch?: boolean;
}

interface UseConversationsReturn {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  isFetchingPreviews: boolean;
  error: string | null;
  onlineUsers: Set<string>;

  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<Message>;
  createConversation: (participantId: string) => Promise<string>;
  handleWebSocketMessage: (wsMessage: WebSocketMessage) => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
  incrementUnreadCount: (conversationId: string) => void;
  markAsRead: (conversationId: string) => void;
}

interface ChatMessageData {
  type: string;
  conversation_id?: string;
  user_id?: string;
  user_ids?: string[];
  status?: "online" | "offline";
  message_id?: string;
  sender_id?: string;
  is_read?: boolean;
  is_delivered?: boolean;
  [key: string]: unknown;
}

export const useConversations = ({
  currentUserId,
  autoFetch = true,
}: UseConversationsProps): UseConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingPreviews, setIsFetchingPreviews] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const processedMessageIds = useRef<Set<string>>(new Set());
  const userConversationMap = useRef<Map<string, string>>(new Map());
  const pendingStatusUpdates = useRef<Map<string, "online" | "offline">>(
    new Map()
  );

  useEffect(() => {
    console.log("🔍 currentUserId:", currentUserId);
  }, [currentUserId]);

  const updateParticipantStatus = useCallback(
    (
      userId: string,
      status: "online" | "offline",
      wsConversationId: string
    ) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        console.log("📋 Online users:", Array.from(next));
        return next;
      });

      userConversationMap.current.set(userId, wsConversationId);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === wsConversationId
            ? {
                ...conv,
                participant: {
                  ...conv.participant,
                  id: userId,
                  status:
                    status === "online"
                      ? ("online" as const)
                      : ("offline" as const),
                  isOnline: status === "online",
                },
              }
            : conv
        )
      );
    },
    []
  );

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getConversations();

      const defaultedData = data.map((conv) => ({
        ...conv,
        participant: {
          ...conv.participant,
          status: "offline" as const,
          isOnline: false,
        },
      }));

      setConversations(defaultedData);

      if (defaultedData.length > 0) {
        setIsFetchingPreviews(true);

        await Promise.allSettled(
          defaultedData.map(async (conv) => {
            try {
              const msgs = await chatService.getMessages(
                conv.id,
                currentUserId
              );

              if (msgs.length > 0) {
                const lastMsg = msgs[msgs.length - 1];
                const firstOtherMsg = msgs.find(
                  (m) => m.senderId !== currentUserId
                );

                if (firstOtherMsg) {
                  userConversationMap.current.set(
                    firstOtherMsg.senderId,
                    conv.id
                  );
                }

                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id !== conv.id) return c;
                    return {
                      ...c,
                      lastMessage: {
                        text: lastMsg.text,
                        timestamp: lastMsg.timestamp,
                        isRead: lastMsg.isRead,
                      },
                      participant: {
                        ...c.participant,
                        ...(firstOtherMsg && { id: firstOtherMsg.senderId }),
                        ...(firstOtherMsg?.senderName && {
                          name: firstOtherMsg.senderName,
                        }),
                        status: "offline" as const,
                        isOnline: false,
                      },
                    };
                  })
                );

                processedMessageIds.current = new Set([
                  ...processedMessageIds.current,
                  ...msgs.map((m) => m.id),
                ]);

                setMessages((prev) => ({
                  ...prev,
                  [conv.id]: msgs,
                }));
              }
            } catch (e) {
              console.warn(`⚠️ Could not load preview for ${conv.id}:`, e);
            }
          })
        );

        if (pendingStatusUpdates.current.size > 0) {
          pendingStatusUpdates.current.forEach((status, userId) => {
            const conversationId = userConversationMap.current.get(userId);
            if (conversationId) {
              setOnlineUsers((prev) => {
                const next = new Set(prev);
                if (status === "online") {
                  next.add(userId);
                } else {
                  next.delete(userId);
                }
                return next;
              });
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === conversationId
                    ? {
                        ...conv,
                        participant: {
                          ...conv.participant,
                          id: userId,
                          status:
                            status === "online"
                              ? ("online" as const)
                              : ("offline" as const),
                          isOnline: status === "online",
                        },
                      }
                    : conv
                )
              );
              pendingStatusUpdates.current.delete(userId);
            }
          });
        }

        setIsFetchingPreviews(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch conversations";
      toast.error(errorMessage);
      console.error("Error fetching conversations:");
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await chatService.getMessages(
          conversationId,
          currentUserId
        );

        data.forEach((msg) => {
          processedMessageIds.current.add(msg.id);
          if (msg.senderId !== currentUserId) {
            userConversationMap.current.set(msg.senderId, conversationId);
          }
        });

        setMessages((prev) => ({
          ...prev,
          [conversationId]: data,
        }));

        if (data.length > 0) {
          const lastMsg = data[data.length - 1];
          const otherUserMsg = data.find((m) => m.senderId !== currentUserId);

          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id !== conversationId) return conv;
              return {
                ...conv,
                lastMessage: {
                  text: lastMsg.text,
                  timestamp: lastMsg.timestamp,
                  isRead: lastMsg.isRead,
                },
                participant: {
                  ...conv.participant,
                  ...(otherUserMsg && { id: otherUserMsg.senderId }),
                  ...(otherUserMsg?.senderName && {
                    name: otherUserMsg.senderName,
                  }),
                  status:
                    otherUserMsg && onlineUsers.has(otherUserMsg.senderId)
                      ? ("online" as const)
                      : ("offline" as const),
                  isOnline: otherUserMsg
                    ? onlineUsers.has(otherUserMsg.senderId)
                    : false,
                },
              };
            })
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch messages";
        setError(errorMessage);
        console.error(`Error fetching messages for ${conversationId}:`, err);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUserId, onlineUsers]
  );

  const updateLastMessage = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                lastMessage: {
                  text: message.text,
                  timestamp: message.timestamp,
                  isRead: message.senderId === currentUserId,
                },
              }
            : conv
        )
      );
    },
    [currentUserId]
  );

  const sendMessage = useCallback(
    async (conversationId: string, text: string): Promise<Message> => {
      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const optimisticMessage: Message = {
        id: tempId,
        senderId: currentUserId,
        text,
        timestamp: new Date().toISOString(),
        isRead: false,
        isDelivered: false,
        senderName: "You",
      };

      processedMessageIds.current.add(tempId);

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), optimisticMessage],
      }));

      updateLastMessage(conversationId, optimisticMessage);
      return optimisticMessage;
    },
    [currentUserId, updateLastMessage]
  );

  const createConversation = useCallback(
    async (participantId: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await chatService.createConversation(participantId);
        await fetchConversations();
        return response.id;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create conversation";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchConversations]
  );

  const incrementUnreadCount = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, unreadCount: conv.unreadCount + 1 }
          : conv
      )
    );
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              lastMessage: { ...conv.lastMessage, isRead: true },
            }
          : conv
      )
    );
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((msg) => ({
        ...msg,
        isRead: true,
      })),
    }));
  }, []);

  const handleWebSocketMessage = useCallback(
    (wsMessage: WebSocketMessage) => {
      console.log("📨 WebSocket message:", wsMessage);

      if (wsMessage.type === "message" && wsMessage.conversationId) {
        const chatMessage = wsMessage.data as ChatMessageData;

        if (chatMessage.type === "connection_established") {
          console.log("🔗 Connected:", chatMessage.conversation_id);
          return;
        }
        if (chatMessage.type === "online_users") {
          const userIds = chatMessage.user_ids as string[];
          if (!Array.isArray(userIds)) return;

          console.log("👥 Online users batch received:", userIds);

          setOnlineUsers((prev) => {
            const next = new Set(prev);
            userIds.forEach((uid) => {
              if (uid !== currentUserId) next.add(uid);
            });
            console.log("📋 Online users after batch:", Array.from(next));
            return next;
          });

          setConversations((prev) =>
            prev.map((conv) => {
              const isOnline = userIds.includes(conv.participant.id);
              if (!isOnline) return conv;
              return {
                ...conv,
                participant: {
                  ...conv.participant,
                  status: "online" as const,
                  isOnline: true,
                },
              };
            })
          );
          return;
        }

        // ─── user_status ──────────────────────────────────────────────────
        if (chatMessage.type === "user_status") {
          const userId = chatMessage.user_id as string;
          const status = chatMessage.status as "online" | "offline";

          if (userId === currentUserId) {
            console.log("🔕 Ignoring own user_status");
            return;
          }

          console.log(
            `👤 ${userId} is now ${status} in conversation ${wsMessage.conversationId}`
          );

          const mappedConvId = userConversationMap.current.get(userId);

          if (mappedConvId || wsMessage.conversationId) {
            updateParticipantStatus(
              userId,
              status,
              mappedConvId || wsMessage.conversationId
            );
          } else {
            console.warn(`⏳ Storing pending status for ${userId}`);
            pendingStatusUpdates.current.set(userId, status);
          }
          return;
        }

        // ─── status_update ────────────────────────────────────────────────
        if (chatMessage.type === "status_update") {
          if (!chatMessage.message_id) return;
          const messageId = chatMessage.message_id;

          setMessages((prev) => {
            const convMessages = prev[wsMessage.conversationId!] || [];
            return {
              ...prev,
              [wsMessage.conversationId!]: convMessages.map((msg): Message => {
                if (msg.id === messageId) {
                  return {
                    ...msg,
                    isRead: chatMessage.is_read ?? msg.isRead,
                    isDelivered: chatMessage.is_delivered ?? msg.isDelivered,
                  };
                }
                if (
                  msg.id.startsWith("temp_") &&
                  msg.senderId === currentUserId &&
                  new Date().getTime() - new Date(msg.timestamp).getTime() <
                    5000
                ) {
                  return {
                    ...msg,
                    id: messageId,
                    isRead: chatMessage.is_read ?? msg.isRead,
                    isDelivered: chatMessage.is_delivered ?? msg.isDelivered,
                  };
                }
                return msg;
              }),
            };
          });
          return;
        }

        // ─── chat_message ─────────────────────────────────────────────────
        if (chatMessage.type === "chat_message") {
          if (!chatMessage.message_id || !chatMessage.sender_id) return;
          const messageId = chatMessage.message_id;
          const senderId = chatMessage.sender_id;

          if (senderId !== currentUserId && wsMessage.conversationId) {
            userConversationMap.current.set(senderId, wsMessage.conversationId);

            setConversations((prev) =>
              prev.map((conv) => {
                if (conv.id !== wsMessage.conversationId) return conv;
                if (conv.participant.id === senderId) return conv;
                return {
                  ...conv,
                  participant: { ...conv.participant, id: senderId },
                };
              })
            );

            if (pendingStatusUpdates.current.has(senderId)) {
              const status = pendingStatusUpdates.current.get(senderId)!;
              updateParticipantStatus(
                senderId,
                status,
                wsMessage.conversationId
              );
              pendingStatusUpdates.current.delete(senderId);
            }
          }

          if (processedMessageIds.current.has(messageId)) return;
          processedMessageIds.current.add(messageId);

          const newMessage = mapWebSocketMessageToComponent(
            chatMessage as unknown as WebSocketChatMessage,
            currentUserId
          );

          setMessages((prev) => {
            const existing = prev[wsMessage.conversationId!] || [];
            if (newMessage.senderId === currentUserId) {
              const now = new Date().getTime();
              const filtered = existing.filter((msg) => {
                if (!msg.id.startsWith("temp_")) return true;
                if (
                  msg.text === newMessage.text &&
                  now - new Date(msg.timestamp).getTime() < 5000
                ) {
                  processedMessageIds.current.delete(msg.id);
                  return false;
                }
                return true;
              });
              return {
                ...prev,
                [wsMessage.conversationId!]: [...filtered, newMessage],
              };
            }
            return {
              ...prev,
              [wsMessage.conversationId!]: [...existing, newMessage],
            };
          });

          updateLastMessage(wsMessage.conversationId, newMessage);

          if (newMessage.senderId !== currentUserId) {
            incrementUnreadCount(wsMessage.conversationId);
          }
        }
      }

      if (wsMessage.type === "read" && wsMessage.conversationId) {
        markAsRead(wsMessage.conversationId);
      }
    },
    [
      currentUserId,
      updateParticipantStatus,
      updateLastMessage,
      incrementUnreadCount,
      markAsRead,
    ]
  );

  useEffect(() => {
    if (autoFetch && currentUserId) {
      fetchConversations();
    }
  }, [autoFetch, currentUserId, fetchConversations]);

  return {
    conversations,
    messages,
    isLoading,
    isFetchingPreviews,
    error,
    onlineUsers,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    handleWebSocketMessage,
    updateLastMessage,
    incrementUnreadCount,
    markAsRead,
  };
};

export default useConversations;
