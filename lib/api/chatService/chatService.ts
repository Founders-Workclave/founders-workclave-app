import { getAuthToken } from "@/lib/api/auth";
import {
  MessageApiResponse,
  CreateConversationResponse,
  Message,
  Conversation,
  mapApiMessageToComponent,
  mapApiConversationToComponent,
} from "@/types/chat";

export const chatService = {
  /**
   * Fetch all messages for a conversation
   */
  async getMessages(
    conversationId: string,
    currentUserId: string
  ): Promise<Message[]> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

      const url = `${baseUrl}/chat/conversation/${conversationId}/messages/`;
      const token = getAuthToken();

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      const messages: MessageApiResponse[] = Array.isArray(data)
        ? data
        : data.messages || data.messageList || data.results || [];

      return messages.map((msg) =>
        mapApiMessageToComponent(msg, currentUserId)
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(
    participantId: string
  ): Promise<CreateConversationResponse> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/chat/conversation/`;
      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ participant_id: participantId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Failed to create conversation:", error);
      throw error;
    }
  },

  /**
   * Send a message to a conversation via HTTP
   */
  async sendMessage(
    conversationId: string,
    message: string
  ): Promise<MessageApiResponse> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/chat/conversation/${conversationId}/messages/`;

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("❌ Failed to send message via HTTP:", error);
      throw error;
    }
  },

  /**
   * Get all conversations
   */
  async getConversations(): Promise<Conversation[]> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/chat/conversation/list/`;
      const token = getAuthToken();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();

      const conversations: Parameters<
        typeof mapApiConversationToComponent
      >[0][] = Array.isArray(data)
        ? data
        : data.conversationList ||
          data.results ||
          data.conversations ||
          data.data ||
          [];

      return conversations.map(mapApiConversationToComponent);
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
      throw error;
    }
  },

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(
    conversationId: string,
    messageIds: string[]
  ): Promise<void> {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";
      const url = `${baseUrl}/chat/messages/${conversationId}/mark-read/`;

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message_ids: messageIds }),
      });

      if (!response.ok) {
        throw new Error(`Failed to mark messages as read: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Failed to mark messages as read:", error);
      throw error;
    }
  },
};

export default chatService;
