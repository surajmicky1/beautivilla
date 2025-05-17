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

  // This is a temporary placeholder for WebSocket functionality
  // We're disabling it for now to address connection issues
  // The chat functionality will be implemented in a future update
  
  // Send message function (disabled for now)
  const sendMessage = (message: any) => {
    console.log("WebSocket message sending disabled", message);
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