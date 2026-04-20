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

export interface ConversationListResponse {
  conversations: Array<{
    id: string;
    mode: ChatMode;
    title: string;
    project: null | string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface ConversationMessagesResponse {
  conversation: Array<{
    id: string;
    role: MessageRole;
    content: string;
    created_at: string;
    prd_document: null | string;
  }>;
}

export interface GeneratePRDPdfResponse {
  conversation_id: string;
  status: "Success" | "Failed";
  pdf_url: string;
}

export interface DeleteConversationResponse {
  message: string;
}
