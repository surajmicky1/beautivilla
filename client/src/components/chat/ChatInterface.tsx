import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useSocket } from "@/lib/socket";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface Message {
  id: number;
  userId: number;
  adminId: number | null;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatUser {
  id: number;
  name: string;
  email: string;
  unreadCount: number;
}

interface ChatInterfaceProps {
  isAdmin?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isAdmin = false }) => {
  const { user } = useAuth();
  const { socket, isConnected, sendMessage } = useSocket();
  const [message, setMessage] = useState("");
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages based on role
  const { data: chatData, refetch: refetchMessages } = useQuery<Message[] | ChatUser[]>({
    queryKey: ['/api/messages', activeUserId],
    queryFn: async () => {
      const url = isAdmin && activeUserId 
        ? `/api/messages?userId=${activeUserId}` 
        : '/api/messages';
      
      const response = await fetch(url, {
        headers: {
          'x-auth-token': localStorage.getItem('token') || '',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      return response.json();
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string; userId?: number; adminId?: number }) => {
      return apiRequest('POST', '/api/messages', messageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', activeUserId] });
    },
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest('PATCH', '/api/messages/read', { userId });
    },
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatData]);

  // Listen for WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          refetchMessages();
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleWebSocketMessage);

    return () => {
      socket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [socket, refetchMessages]);

  // Mark messages as read when changing active user
  useEffect(() => {
    if (isAdmin && activeUserId) {
      markAsReadMutation.mutate(activeUserId);
    }
  }, [isAdmin, activeUserId]);

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const messageData: { content: string; userId?: number; adminId?: number } = {
      content: message,
    };

    // Set userId/adminId based on role
    if (isAdmin && activeUserId) {
      messageData.userId = activeUserId;
      messageData.adminId = user.id;
    } else {
      messageData.userId = user.id;
    }

    // Send to server
    sendMessageMutation.mutate(messageData);

    // Send via WebSocket if connected
    if (isConnected) {
      sendMessage({
        type: 'message',
        ...messageData,
      });
    }

    setMessage("");
  };

  // Handle selecting a user (admin only)
  const handleSelectUser = (userId: number) => {
    setActiveUserId(userId);
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine if a message is from the current user
  const isOwnMessage = (message: Message) => {
    if (isAdmin) {
      return message.adminId === user?.id;
    }
    return message.userId === user?.id;
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Admin chat interface
  if (isAdmin) {
    const usersList = Array.isArray(chatData) && !activeUserId ? chatData as ChatUser[] : [];
    const messages = activeUserId && Array.isArray(chatData) ? chatData as Message[] : [];

    return (
      <div className="flex h-[70vh] border rounded-lg overflow-hidden">
        {/* Users list */}
        <div className="w-1/3 border-r bg-white overflow-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Active Conversations</h3>
          </div>
          <div className="divide-y">
            {usersList.length === 0 ? (
              <div className="p-4 text-center text-neutral-medium">No active conversations</div>
            ) : (
              usersList.map(user => (
                <div 
                  key={user.id}
                  className={`p-4 flex items-center hover:bg-gray-50 cursor-pointer ${
                    activeUserId === user.id ? 'bg-primary bg-opacity-10' : ''
                  }`}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <Avatar className="h-10 w-10 bg-secondary text-white">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.unreadCount > 0 && (
                    <div className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                      {user.unreadCount}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {activeUserId ? (
            <>
              <div className="p-4 border-b bg-white flex items-center">
                <Avatar className="h-8 w-8 bg-secondary text-white mr-2">
                  <AvatarFallback>
                    {getInitials(usersList.find(u => u.id === activeUserId)?.name || '')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">
                  {usersList.find(u => u.id === activeUserId)?.name || 'Customer'}
                </h3>
              </div>
              <div className="flex-1 p-4 overflow-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-neutral-medium mt-4">No messages yet</div>
                ) : (
                  messages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`mb-4 flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          isOwnMessage(msg) 
                            ? 'bg-accent text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage(msg) ? 'text-white/80' : 'text-gray-500'}`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} className="bg-accent hover:bg-accent-dark">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-neutral-medium">
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User chat interface
  const messages = Array.isArray(chatData) ? chatData as Message[] : [];
  
  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle>Chat with Beauty Villa Support</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-medium mt-4">
            <p>No messages yet. Start a conversation with our team!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg.id}
              className={`mb-4 flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  isOwnMessage(msg) 
                    ? 'bg-accent text-white rounded-br-none' 
                    : 'bg-secondary text-white rounded-bl-none'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs mt-1 text-white/80">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4 bg-white">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            className="bg-accent hover:bg-accent-dark"
            disabled={!isConnected || sendMessageMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
