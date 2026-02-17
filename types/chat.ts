export interface MessageApiResponse {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  is_delivered: boolean;
}

export interface ActualConversationApiResponse {
  conversation: string;
  otherUserName: string;
  lastMessage: string;
  unreadMessage: number;
}

export interface ConversationApiResponse {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  last_message?: {
    message: string;
    timestamp: string;
  };
  unread_count?: number;
  created_at: string;
}

export interface CreateConversationRequest {
  participant_id: string;
}

export interface CreateConversationResponse {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
}

// Component Types
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isDelivered?: boolean;
  senderName?: string;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: "online" | "offline" | "away";
  isOnline?: boolean; // ✅ Added missing field
}

export interface LastMessage {
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: Participant;
  lastMessage: LastMessage;
  unreadCount: number;
}

// WebSocket Types
export interface WebSocketMessage<T = unknown> {
  type: "message" | "read" | "typing" | "online" | "error";
  data: T;
  conversationId?: string;
  error?: string;
}

export interface WebSocketChatMessage {
  type: "chat_message";
  message: string;
  sender: string;
  sender_id: string;
  message_id: string;
  timestamp: string;
  is_read: boolean;
  is_delivered: boolean;
}

export interface WebSocketUserStatus {
  type: "user_status";
  user_id: string;
  status: "online" | "offline";
}

export interface WebSocketStatusUpdate {
  type: "status_update";
  message_id: string;
  user_id: string;
  is_read: boolean;
  is_delivered: boolean;
}

export interface WebSocketTypingIndicator {
  userId: string;
  isTyping: boolean;
}

export interface WebSocketReadReceipt {
  messageId: string;
  userId: string;
}

export interface SendMessagePayload {
  message: string;
}

// ✅ Proper type for the raw API conversation response instead of `any`
export interface RawApiConversation {
  conversation: string;
  otherUserName?: string;
  otherUserId?: string;
  other_user_id?: string;
  lastMessage?: string;
  unreadMessage?: number;
  [key: string]: unknown;
}

/**
 * Format timestamp for display
 */
export function formatMessageTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Map API message to component format
 */
export function mapApiMessageToComponent(
  apiMessage: MessageApiResponse,
  _currentUserId: string
): Message {
  return {
    id: apiMessage.id,
    senderId: apiMessage.sender,
    senderName: apiMessage.senderName,
    text: apiMessage.content,
    timestamp: apiMessage.timestamp,
    isRead: apiMessage.is_read,
    isDelivered: apiMessage.is_delivered,
  };
}

/**
 * Map WebSocket message to component format
 */
export function mapWebSocketMessageToComponent(
  wsMessage: WebSocketChatMessage,
  _currentUserId: string
): Message {
  return {
    id: wsMessage.message_id || `msg_${Date.now()}_${Math.random()}`,
    senderId: wsMessage.sender_id,
    senderName: wsMessage.sender,
    text: wsMessage.message,
    timestamp: wsMessage.timestamp,
    isRead: wsMessage.is_read || false,
    isDelivered: wsMessage.is_delivered || false,
  };
}

export function mapApiConversationToComponent(
  apiConversation: RawApiConversation
): Conversation {
  const conversationId = apiConversation.conversation;
  const userName = apiConversation.otherUserName;
  const otherUserId =
    apiConversation.otherUserId ||
    apiConversation.other_user_id ||
    conversationId;

  return {
    id: conversationId,
    participant: {
      id: otherUserId,
      name: userName || "Unknown User",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${
        userName || "User"
      }`,
      role: "User",
      status: "offline",
      isOnline: false,
    },
    lastMessage: {
      text: apiConversation.lastMessage || "No messages yet",
      timestamp: "",
      isRead: true,
    },
    unreadCount: apiConversation.unreadMessage || 0,
  };
}
