import { useEffect, useRef, useState, useCallback } from 'react';
import { authService } from '@/lib/services/authService';

export interface SSENotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface UseSSENotificationsOptions {
  userId: string | null;
  onNotification?: (notification: SSENotification) => void;
  onError?: (error: Error) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useSSENotifications({
  userId,
  onNotification,
  onError,
  autoReconnect = true,
  reconnectInterval = 5000,
}: UseSSENotificationsOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<SSENotification[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connectSSE = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      // Create abort controller for this connection
      abortControllerRef.current = new AbortController();

      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8080';
      const url = `${baseUrl}/api/notifications/stream/${userId}`;

      console.log('Connecting to SSE:', url);

      // Use authenticatedFetch for proper JWT auth handling
      const response = await authService.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      setIsConnected(true);
      console.log('SSE connection established');

      // Clear any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('SSE stream ended normally');
          setIsConnected(false);
          break;
        }

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });

        // Split by line breaks to process SSE events
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Parse SSE data lines
          if (trimmedLine.startsWith('data:')) {
            const data = trimmedLine.substring(5).trim();
            
            // Skip heartbeat pings or empty data
            if (!data || data === 'ping' || data === ':' || data === 'heartbeat') {
              continue;
            }

            try {
              const notification: SSENotification = JSON.parse(data);
              console.log('Received notification:', notification);

              setNotifications((prev) => [notification, ...prev]);

              if (onNotification) {
                onNotification(notification);
              }
            } catch (parseError) {
              console.error('Failed to parse notification:', parseError, 'Data:', data);
            }
          }
        }
      }

      // Stream ended, try to reconnect if enabled
      if (autoReconnect) {
        console.log(`Stream ended. Reconnecting in ${reconnectInterval}ms...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
        }, reconnectInterval);
      }

    } catch (error: any) {
      console.error('SSE connection error:', error);
      setIsConnected(false);

      // Don't reconnect if it was deliberately aborted
      if (error.name !== 'AbortError') {
        if (onError) {
          onError(error);
        }

        // Auto-reconnect if enabled
        if (autoReconnect) {
          console.log(`Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connectSSE();
          }, reconnectInterval);
        }
      }
    }
  }, [userId, onNotification, onError, autoReconnect, reconnectInterval]);

  useEffect(() => {
    connectSSE();

    // Cleanup
    return () => {
      console.log('Cleaning up SSE connection');
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = undefined;
      }
      
      setIsConnected(false);
    };
  }, [connectSSE]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const reconnect = useCallback(() => {
    // Abort current connection
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear any pending reconnect
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    // Reconnect immediately
    connectSSE();
  }, [connectSSE]);

  return {
    isConnected,
    notifications,
    clearNotifications,
    reconnect,
  };
}
