import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { NodeStatus, WebSocketResponse } from '@/types/komari';

export function useWebSocket(url: string, refreshInterval: number = 3000) {
  const [data, setData] = useState<Record<string, NodeStatus>>({});
  const [online, setOnline] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = url.startsWith('ws') ? url : `${protocol}//${window.location.host}${url}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
        // Request initial data
        ws.send('get');
      };

      ws.onmessage = (event) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          if (response.status === 'success' && response.data) {
            // Use functional updates to prevent unnecessary re-renders
            setOnline(prev => {
              const newOnline = response.data.online || [];
              return JSON.stringify(prev) !== JSON.stringify(newOnline) ? newOnline : prev;
            });
            setData(prev => {
              const newData = response.data.data || {};
              return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Exponential backoff reconnection strategy
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current++;
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();

    // Set up periodic "get" requests with configurable interval
    const intervalId = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send('get');
      }
    }, refreshInterval);

    return () => {
      clearInterval(intervalId);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, refreshInterval]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({ 
    data, 
    online, 
    isConnected 
  }), [data, online, isConnected]);
}
