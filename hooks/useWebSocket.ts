import { useEffect, useRef, useState, useCallback } from "react";
import { getAuthToken } from "@/lib/api/auth";
import type { WebSocketMessage } from "@/types/chat";

export interface UseWebSocketProps {
  conversationId: string | null;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoConnect?: boolean;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: { message: string }) => void;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WS_URL || "wss://foundersapi.up.railway.app/ws";

export const useWebSocket = ({
  conversationId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  autoConnect = true,
}: UseWebSocketProps): UseWebSocketReturn => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttempts = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);
  useEffect(() => {
    onConnectRef.current = onConnect;
  }, [onConnect]);
  useEffect(() => {
    onDisconnectRef.current = onDisconnect;
  }, [onDisconnect]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const disconnect = useCallback((silent = false) => {
    console.log("🔌 Disconnecting WebSocket...");

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = undefined;
    }

    if (ws.current) {
      // Null out handlers first so onclose doesn't trigger reconnect logic
      ws.current.onopen = null;
      ws.current.onmessage = null;
      ws.current.onerror = null;
      ws.current.onclose = null;
      ws.current.close(1000, "Client disconnecting");
      ws.current = null;
    }

    if (mountedRef.current && !silent) {
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (!conversationId) {
      console.log(
        "⏸️  No conversation selected, skipping WebSocket connection"
      );
      return;
    }

    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("✅ WebSocket already connected");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("❌ No auth token available for WebSocket connection");
      return;
    }

    try {
      const wsUrl = `${WS_BASE_URL}/chat/${conversationId}/?token=${token}`;
      console.log("🔌 Connecting to WebSocket:", wsUrl.replace(token, "***"));

      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        // Ignore events from a stale socket that was replaced
        if (ws.current !== socket) return;

        console.log("✅ WebSocket connected successfully!");
        reconnectAttempts.current = 0;

        if (mountedRef.current) {
          setIsConnected(true);
          onConnectRef.current?.();
        }
      };

      socket.onmessage = (event: MessageEvent) => {
        if (ws.current !== socket) return;

        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);

          const message: WebSocketMessage = {
            type: "message",
            data,
            conversationId: conversationId,
          };

          onMessageRef.current?.(message);
        } catch (error) {
          console.error("❌ Failed to parse WebSocket message:", error);
        }
      };

      socket.onerror = (error: Event) => {
        if (ws.current !== socket) return;
        console.error("❌ WebSocket error:", error);
        onErrorRef.current?.(error);
      };

      socket.onclose = (event: CloseEvent) => {
        if (ws.current !== socket) return;

        console.log("🔌 WebSocket disconnected:", {
          code: event.code,
          reason: event.reason || "No reason provided",
          wasClean: event.wasClean,
        });

        if (mountedRef.current) {
          setIsConnected(false);
          onDisconnectRef.current?.();

          if (
            event.code !== 1000 &&
            reconnectAttempts.current < maxReconnectAttempts
          ) {
            reconnectAttempts.current++;
            console.log(
              `🔄 Reconnecting... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
            );

            reconnectTimeout.current = setTimeout(() => {
              if (mountedRef.current) connect();
            }, reconnectDelay);
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error("❌ Max reconnection attempts reached.");
          }
        }
      };
    } catch (error) {
      console.error("❌ WebSocket connection error:", error);
    }
  }, [conversationId]);

  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnection triggered");
    reconnectAttempts.current = 0;
    disconnect();
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  const sendMessage = useCallback((payload: { message: string }) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("📤 Sending message:", payload);
      ws.current.send(JSON.stringify(payload));
    } else {
      console.warn(
        "⚠️  WebSocket is not connected. Message not sent:",
        payload
      );
    }
  }, []);

  // ✅ Properly tears down old socket before opening new one on conversationId change
  useEffect(() => {
    mountedRef.current = true;

    if (!autoConnect || !conversationId) return;

    // Close whatever socket is currently open before connecting to new conversation
    disconnect(true);
    reconnectAttempts.current = 0;

    const timeoutId = setTimeout(() => {
      if (mountedRef.current) connect();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // ✅ This is the critical fix — close the socket when conversationId changes
      disconnect(true);
    };
  }, [conversationId, autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return { isConnected, sendMessage, connect, disconnect, reconnect };
};

export default useWebSocket;
