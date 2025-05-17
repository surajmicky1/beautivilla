import { WebSocket } from 'ws';
import { storage } from '../storage';
import { type Message } from '@shared/schema';

// Store for connected client WebSockets
type ConnectedClient = {
  ws: WebSocket;
  userId: number;
  role: string;
};

export class ChatManager {
  private clients: Map<number, ConnectedClient> = new Map();
  
  // Add a client to the connection pool
  addClient(userId: number, role: string, ws: WebSocket): void {
    this.clients.set(userId, { ws, userId, role });
  }
  
  // Remove a client from the connection pool
  removeClient(userId: number): void {
    this.clients.delete(userId);
  }
  
  // Get all connected clients
  getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }
  
  // Get all connected admin clients
  getConnectedAdmins(): ConnectedClient[] {
    return this.getConnectedClients().filter(client => client.role === 'admin');
  }
  
  // Send a message to a specific client
  sendMessageToClient(userId: number, message: any): boolean {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }
  
  // Send a message to all admins
  sendMessageToAdmins(message: any): void {
    const admins = this.getConnectedAdmins();
    admins.forEach(admin => {
      if (admin.ws.readyState === WebSocket.OPEN) {
        admin.ws.send(JSON.stringify(message));
      }
    });
  }
  
  // Save a message to the database and send it
  async saveAndSendMessage(message: {
    userId: number;
    adminId?: number;
    content: string;
  }): Promise<Message> {
    // Save message to database
    const savedMessage = await storage.createMessage({
      ...message,
      isRead: false
    });
    
    // Send to recipient
    if (message.adminId) {
      this.sendMessageToClient(message.adminId, {
        type: 'message',
        data: savedMessage
      });
    } else {
      // Send to all admins if no specific admin
      this.sendMessageToAdmins({
        type: 'message',
        data: savedMessage
      });
    }
    
    return savedMessage;
  }
  
  // Mark messages as read
  async markMessagesAsRead(userId: number): Promise<void> {
    await storage.markMessagesAsRead(userId);
    
    // Notify clients that messages have been read
    this.sendMessageToClient(userId, {
      type: 'messages_read'
    });
    
    // Also notify admins
    this.sendMessageToAdmins({
      type: 'messages_read',
      data: { userId }
    });
  }
}

// Export singleton instance
export const chatManager = new ChatManager();
