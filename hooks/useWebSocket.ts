// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from "react";
import type {
  WebSocketMessage,
  UseWebSocketProps,
  UseWebSocketReturn,
} from "@/types/websocket";

export const useWebSocket = <T = unknown>({
  url,
  userId,
  onMessage,
  onConnect,
  onDisconnect,
}: UseWebSocketProps<T>): UseWebSocketReturn<T> => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const mountedRef = useRef<boolean>(true);

  // Use refs for callbacks to avoid dependency issues
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

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

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (mountedRef.current) {
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(() => {
    try {
      // For mock/development, we won't actually connect
      console.log("WebSocket connecting to:", url, "for user:", userId);

      // Simulate connection for development
      if (mountedRef.current) {
        setIsConnected(true);
        onConnectRef.current?.();
      }

      // When implementing real WebSocket, uncomment below:
      /*
      ws.current = new WebSocket(`${url}?userId=${userId}`);
      
      ws.current.onopen = () => {
        console.log("WebSocket connected");
        if (mountedRef.current) {
          setIsConnected(true);
          onConnectRef.current?.();
        }
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage<T>;
          onMessageRef.current?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onerror = (error: Event) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        if (mountedRef.current) {
          setIsConnected(false);
          onDisconnectRef.current?.();
          
          // Auto-reconnect after 3 seconds
          reconnectTimeout.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, 3000);
        }
      };
      */
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }, [url, userId]);

  const sendMessage = useCallback(
    (data: WebSocketMessage<T> | Record<string, unknown>) => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(data));
      } else {
        console.warn("WebSocket is not connected");
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;

    const timeoutId = setTimeout(() => {
      if (mountedRef.current) {
        connect();
      }
    }, 0);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    connect,
    disconnect,
  };
};

export default useWebSocket;
