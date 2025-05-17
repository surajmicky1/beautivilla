
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.tsx";

type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
});

// Custom hook to use socket
export const useSocket = () => useContext(SocketContext);

// Socket Provider component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, isAuthenticated } = useAuth();

  // Initialize WebSocket connection with a proper URL construction
  useEffect(() => {
    // Disable socket connections for now until issues are resolved
    const socketEnabled = false;

    // Disable WebSocket connection completely for now to prevent errors
    const socketEnabled = false;
    
    if (socketEnabled && isAuthenticated && token) {
      try {
        // We'll enable this later when websocket is properly set up
        console.log("WebSocket connections are currently disabled");
        /*
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const wsUrl = `${protocol}//${host}/ws?token=${token}`;
        
        console.log("Attempting to connect WebSocket to:", wsUrl);
        const ws = new WebSocket(wsUrl);
        */

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

        setSocket(ws);

        return () => {
          ws.close();
        };
      } catch (err) {
        console.error("Failed to establish WebSocket connection:", err);
      }
    }

    return () => {};
  }, [isAuthenticated, token]);
  
  // Send message function
  const sendMessage = (message: any) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.log("WebSocket message not sent (disconnected):", message);
    }
  };

  return (
    <SocketContext.Provider 
      value={{
        socket, 
        isConnected, 
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
