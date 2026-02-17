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

      console.log("🔍 Fetching messages from URL:", url);
      console.log("🔍 Conversation ID:", conversationId);

      const token = getAuthToken();
      console.log("🔍 Auth token exists:", !!token);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("🔍 Response status:", response.status);
      console.log("🔍 Response OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("🔍 Error response body:", errorText);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 Messages response data:", data);

      const messages: MessageApiResponse[] = Array.isArray(data)
        ? data
        : data.messages || data.messageList || data.results || [];

      console.log("🔍 Parsed messages count:", messages.length);

      return messages.map((msg) =>
        mapApiMessageToComponent(msg, currentUserId)
      );
    } catch (error) {
      console.error(
        `Failed to fetch messages for conversation ${conversationId}:`,
        error
      );
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

      console.log("🔍 Creating conversation at URL:", url);
      console.log("🔍 Participant ID:", participantId);

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ participant_id: participantId }),
      });

      console.log("🔍 Create conversation response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("🔍 Create conversation error:", errorText);
        throw new Error(`Failed to create conversation: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 Created conversation:", data);
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

      console.log("🔍 Sending message to URL:", url);
      console.log("🔍 Message:", message);

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message }),
      });

      console.log("🔍 Send message response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("🔍 Send message error:", errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 Sent message response:", data);
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

      console.log("🔍 Fetching conversations from URL:", url);

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      console.log("🔍 Conversations response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("🔍 Conversations error:", errorText);
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();
      console.log("📋 Conversations API response:", data);

      // Log first conversation to see structure
      if (data.conversationList && data.conversationList.length > 0) {
        console.log(
          "🔍 First conversation raw data:",
          JSON.stringify(data.conversationList[0], null, 2)
        );
      }

      // ✅ Inferred from the mapper's parameter type instead of `any`
      const conversations: Parameters<
        typeof mapApiConversationToComponent
      >[0][] = Array.isArray(data)
        ? data
        : data.conversationList ||
          data.results ||
          data.conversations ||
          data.data ||
          [];

      console.log("✅ Parsed conversations:", conversations);

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

      console.log("🔍 Marking messages as read at URL:", url);

      const token = getAuthToken();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message_ids: messageIds }),
      });

      console.log("🔍 Mark as read response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("🔍 Mark as read error:", errorText);
        throw new Error(`Failed to mark messages as read: ${response.status}`);
      }

      console.log("✅ Messages marked as read");
    } catch (error) {
      console.error("❌ Failed to mark messages as read:", error);
      throw error;
    }
  },
};

export default chatService;
