import { getAuthToken } from "@/lib/api/auth";

import {
  SendMessagePayload,
  SendMessageResponse,
  PRDGenerateResponse,
  ConversationListResponse,
  ConversationMessagesResponse,
  GeneratePRDPdfResponse,
  DeleteConversationResponse,
} from "@/types/bridge";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://foundersapi.up.railway.app";

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

function handleUnauthorized(response: Response): void {
  if (response.status === 401) {
    window.location.href = "/login";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    handleUnauthorized(response);
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export const bridgeService = {
  /**
   * Send a message to Bridge and receive a reply.
   * Optionally pass conversation_id to continue an existing session.
   */
  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    const response = await fetch(`${BASE_URL}/bridge/chat/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<SendMessageResponse>(response);
  },

  /**
   * Generate a PRD (and PDF) from an existing conversation.
   *
   * Endpoint: POST /bridge/conversation/{conversation_id}/generate-prd/
   *
   * Response:
   * - Success: { status: "Success", pdf_url: "https://...", conversation_id: "..." }
   * - Failed:  { status: "Failed", pdf_url: "Error message...", conversation_id: "..." }
   */
  async generatePRD(conversationId: string): Promise<GeneratePRDPdfResponse> {
    const response = await fetch(
      `${BASE_URL}/bridge/conversation/${conversationId}/generate-prd/`,
      {
        method: "POST",
        headers: authHeaders(),
      }
    );

    return handleResponse<GeneratePRDPdfResponse>(response);
  },

  /**
   * Fetch all conversations for the current user.
   */
  async getConversations(): Promise<ConversationListResponse> {
    const response = await fetch(`${BASE_URL}/bridge/conversations/`, {
      method: "GET",
      headers: authHeaders(),
    });

    return handleResponse<ConversationListResponse>(response);
  },

  /**
   * Fetch all messages for a given conversation.
   */
  async getConversationMessages(
    conversationId: string
  ): Promise<ConversationMessagesResponse> {
    const response = await fetch(
      `${BASE_URL}/bridge/conversation/${conversationId}/messages/`,
      {
        method: "GET",
        headers: authHeaders(),
      }
    );

    return handleResponse<ConversationMessagesResponse>(response);
  },

  /**
   * Delete a conversation.
   * DELETE /bridge/conversation/{conversation_id}/messages/
   */
  async deleteConversation(
    conversationId: string
  ): Promise<DeleteConversationResponse> {
    const response = await fetch(
      `${BASE_URL}/bridge/conversation/${conversationId}/messages/`,
      {
        method: "DELETE",
        headers: authHeaders(),
      }
    );

    return handleResponse<DeleteConversationResponse>(response);
  },
};

export default bridgeService;
