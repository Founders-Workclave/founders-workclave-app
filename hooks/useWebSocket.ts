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

/**
 * WebSocket hook for chat functionality
 * Handles connection, reconnection, and message sending with authentication
 */
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
  const reconnectDelay = 3000; // 3 seconds

  // Use refs for callbacks to avoid dependency issues
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
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

  /**
   * Disconnect WebSocket
   */
  const disconnect = useCallback(() => {
    console.log("🔌 Disconnecting WebSocket...");

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = undefined;
    }

    if (ws.current) {
      ws.current.close(1000, "Client disconnecting"); // Normal closure
      ws.current = null;
    }

    if (mountedRef.current) {
      setIsConnected(false);
    }
  }, []);

  /**
   * Connect to WebSocket
   */
  const connect = useCallback(() => {
    // Don't connect if no conversation is selected
    if (!conversationId) {
      console.log(
        "⏸️  No conversation selected, skipping WebSocket connection"
      );
      return;
    }

    // Don't connect if already connected
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("✅ WebSocket already connected");
      return;
    }

    // Get auth token
    const token = getAuthToken();
    if (!token) {
      console.error("❌ No auth token available for WebSocket connection");
      return;
    }

    try {
      const wsUrl = `${WS_BASE_URL}/chat/${conversationId}/?token=${token}`;

      console.log("🔌 Connecting to WebSocket:", wsUrl.replace(token, "***"));

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("✅ WebSocket connected successfully!");
        reconnectAttempts.current = 0; // Reset reconnection attempts

        if (mountedRef.current) {
          setIsConnected(true);
          onConnectRef.current?.();
        }
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", data);

          // Wrap in WebSocketMessage format if needed
          const message: WebSocketMessage = {
            type: "message",
            data: data,
            conversationId: conversationId,
          };

          onMessageRef.current?.(message);
        } catch (error) {
          console.error("❌ Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error("❌ WebSocket error:", error);
        onErrorRef.current?.(error);
      };

      ws.current.onclose = (event: CloseEvent) => {
        console.log("🔌 WebSocket disconnected:", {
          code: event.code,
          reason: event.reason || "No reason provided",
          wasClean: event.wasClean,
        });

        if (mountedRef.current) {
          setIsConnected(false);
          onDisconnectRef.current?.();

          // Auto-reconnect if not a normal closure and we haven't exceeded max attempts
          if (
            event.code !== 1000 && // 1000 = normal closure
            reconnectAttempts.current < maxReconnectAttempts &&
            mountedRef.current
          ) {
            reconnectAttempts.current++;
            console.log(
              `🔄 Reconnecting... (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`
            );

            reconnectTimeout.current = setTimeout(() => {
              if (mountedRef.current) {
                connect();
              }
            }, reconnectDelay);
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error(
              "❌ Max reconnection attempts reached. WebSocket connection failed."
            );
          }
        }
      };
    } catch (error) {
      console.error("❌ WebSocket connection error:", error);
    }
  }, [conversationId]);

  /**
   * Manually trigger reconnection
   */
  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnection triggered");
    reconnectAttempts.current = 0;
    disconnect();
    setTimeout(() => {
      connect();
    }, 100);
  }, [connect, disconnect]);

  /**
   * Send a message through WebSocket
   */
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

  /**
   * Connect on mount and conversation change
   */
  useEffect(() => {
    mountedRef.current = true;

    if (autoConnect && conversationId) {
      // Small delay to ensure component is fully mounted
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          connect();
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [connect, autoConnect, conversationId]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
    reconnect,
  };
};

export default useWebSocket;
