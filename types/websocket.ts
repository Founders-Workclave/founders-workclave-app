// types/websocket.ts
export interface WebSocketMessage<T = unknown> {
  type: "message" | "read" | "typing" | "online";
  data: T;
  conversationId?: string;
}

export interface UseWebSocketProps<T = unknown> {
  url: string;
  userId: string;
  onMessage?: (message: WebSocketMessage<T>) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export interface UseWebSocketReturn<T = unknown> {
  isConnected: boolean;
  sendMessage: (data: WebSocketMessage<T> | Record<string, unknown>) => void;
  connect: () => void;
  disconnect: () => void;
}
