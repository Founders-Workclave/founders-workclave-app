export type MessageRole = "user" | "assistant";

export type ChatMode = "idea_refinement" | "prd_generation";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  mode: ChatMode;
  createdAt: Date;
}

export interface SendMessagePayload {
  message: string;
  mode: ChatMode;
  conversation_id?: string;
}

export interface SendMessageResponse {
  conversation_id: string;
  message: {
    content: string;
    role: MessageRole;
  };
}

export interface PRDGeneratePayload {
  conversation_id: string;
}

export interface PRDGenerateResponse {
  prd_content: string;
}
