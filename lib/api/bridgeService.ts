import { getAuthToken } from "@/lib/api/auth";
import {
  SendMessagePayload,
  SendMessageResponse,
  PRDGeneratePayload,
  PRDGenerateResponse,
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
   * Generate a PRD document from an existing conversation.
   */
  async generatePRD(payload: PRDGeneratePayload): Promise<PRDGenerateResponse> {
    const response = await fetch(`${BASE_URL}/bridge/prd/generate/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse<PRDGenerateResponse>(response);
  },
};

export default bridgeService;
