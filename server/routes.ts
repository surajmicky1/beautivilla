import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  insertUserSchema,
  loginSchema,
  insertServiceSchema,
  insertProductSchema,
  insertAppointmentSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertMessageSchema,
  insertContactSchema,
  insertTestimonialSchema,
  razorpayVerificationSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { authMiddleware, adminMiddleware } from "./middlewares/auth";
import { createRazorpayOrder, verifyRazorpayPayment } from "./middlewares/razorpay";

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "beauty-villa-secret-key";

// Connected clients for chat
const connectedClients: Map<number, WebSocket> = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    // Expected URL format: /ws?token=jwt-token
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      const userId = decoded.id;
      
      connectedClients.set(userId, ws);
      
      // Handle messages from clients
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          if (data.type === 'message') {
            // Create a new message in the database
            const newMessage = await storage.createMessage({
              userId: data.userId,
              adminId: data.adminId,
              content: data.content,
              isRead: false
            });
            
            // Send the message to the recipient if they're online
            const recipientId = data.adminId || data.userId;
            const recipientWs = connectedClients.get(recipientId);
            
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'message',
                message: newMessage
              }));
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      });
      
      // Handle disconnection
      ws.on('close', () => {
        connectedClients.delete(userId);
      });
      
    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  });

  // ===== Authentication Routes =====
  
  // Register new user
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user
      const newUser = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user info (without password) and token
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Return user info (without password) and token
      const { password, ...userWithoutPassword } = user;
      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get current user
  app.get('/api/auth/user', authMiddleware, async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.user?.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ===== Service Routes =====
  
  // Get all services
  app.get('/api/services', async (_req: Request, res: Response) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get service by ID
  app.get('/api/services/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const service = await storage.getService(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Create service (admin only)
  app.post('/api/services', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const newService = await storage.createService(serviceData);
      res.status(201).json(newService);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update service (admin only)
  app.put('/api/services/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const serviceData = req.body;
      
      const updatedService = await storage.updateService(id, serviceData);
      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(updatedService);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete service (admin only)
  app.delete('/api/services/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteService(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ===== Product Routes =====
  
  // Get all products
  app.get('/api/products', async (_req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get featured products
  app.get('/api/products/featured', async (_req: Request, res: Response) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get product by ID
  app.get('/api/products/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Create product (admin only)
  app.post('/api/products', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update product (admin only)
  app.put('/api/products/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const productData = req.body;
      
      const updatedProduct = await storage.updateProduct(id, productData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete product (admin only)
  app.delete('/api/products/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ===== Appointment Routes =====
  
  // Get all appointments (admin only)
  app.get('/api/appointments', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get user appointments
  app.get('/api/user/appointments', authMiddleware, async (req: Request, res: Response) => {
    try {
      const appointments = await storage.getUserAppointments(req.user?.id);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get appointment by ID
  app.get('/api/appointments/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      // Only allow users to view their own appointments or admins to view any
      if (req.user?.role !== 'admin' && appointment.userId !== req.user?.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Book an appointment
  app.post('/api/appointments', authMiddleware, async (req: Request, res: Response) => {
    try {
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const newAppointment = await storage.createAppointment(appointmentData);
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update appointment status (admin only)
  app.patch('/api/appointments/:id/status', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedAppointment = await storage.updateAppointmentStatus(id, status);
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Cancel an appointment (user)
  app.patch('/api/user/appointments/:id/cancel', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const appointment = await storage.getAppointment(id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      if (appointment.userId !== req.user?.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const updatedAppointment = await storage.updateAppointmentStatus(id, 'cancelled');
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ===== Order & Payment Routes =====
  
  // Get all orders (admin only)
  app.get('/api/orders', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get user orders
  app.get('/api/user/orders', authMiddleware, async (req: Request, res: Response) => {
    try {
      const orders = await storage.getUserOrders(req.user?.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get order by ID
  app.get('/api/orders/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const orderWithItems = await storage.getOrderWithItems(id);
      
      if (!orderWithItems) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Only allow users to view their own orders or admins to view any
      if (req.user?.role !== 'admin' && orderWithItems.order.userId !== req.user?.id) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      res.json(orderWithItems);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Create Razorpay order
  app.post('/api/orders/create', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { amount, items } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }
      
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
      }
      
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`
      });
      
      // Create order in database
      const order = await storage.createOrder({
        userId: req.user?.id,
        status: 'pending',
        total: amount,
        razorpayOrderId: razorpayOrder.id
      });
      
      // Add order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
      }
      
      res.status(201).json({
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount / 100, // Convert from paise
        currency: razorpayOrder.currency
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Verify Razorpay payment
  app.post('/api/orders/verify', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { orderId } = req.body;
      const paymentData = razorpayVerificationSchema.parse(req.body);
      
      // Verify payment signature
      const isValid = verifyRazorpayPayment(paymentData);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      
      // Update order status
      const order = await storage.getOrder(parseInt(orderId));
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      await storage.updateOrderStatus(order.id, 'paid');
      
      // Update order with payment ID
      const updatedOrder = await storage.updateOrder(order.id, {
        paymentId: paymentData.razorpay_payment_id,
        status: 'paid'
      });
      
      res.json({
        success: true,
        order: updatedOrder
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  // Update order status (admin only)
  app.patch('/api/orders/:id/status', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'paid', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ===== Message Routes =====
  
  // Get messages for a user
  app.get('/api/messages', authMiddleware, async (req: Request, res: Response) => {
    try {
      let messages;
      
      if (req.user?.role === 'admin') {
        // Admin can see all messages
        const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
        
        if (userId) {
          messages = await storage.getUserMessages(userId);
        } else {
          // Get all user IDs with messages
          const allMessages = await storage.getMessages(req.user?.id);
          const userIds = [...new Set(allMessages.map(m => m.userId))];
          
          // Get users info
          const usersWithMessages = [];
          for (const userId of userIds) {
            const user = await storage.getUser(userId);
            if (user) {
              const { password, ...userInfo } = user;
              const unreadCount = allMessages.filter(m => m.userId === userId && !m.isRead).length;
              usersWithMessages.push({
                ...userInfo,
                unreadCount
              });
            }
          }
          return res.json(usersWithMessages);
        }
      } else {
        // Regular user can only see their messages
        messages = await storage.getMessages(req.user?.id);
      }
      
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Send a message
  app.post('/api/messages', authMiddleware, async (req: Request, res: Response) => {
    try {
      let messageData;
      
      if (req.user?.role === 'admin') {
        // Admin sending to user
        messageData = insertMessageSchema.parse({
          ...req.body,
          adminId: req.user?.id
        });
      } else {
        // User sending to admin
        const admins = await storage.getAdmins();
        if (admins.length === 0) {
          return res.status(400).json({ message: 'No admin available' });
        }
        
        messageData = insertMessageSchema.parse({
          ...req.body,
          userId: req.user?.id,
          adminId: admins[0].id // Send to first admin
        });
      }
      
      const newMessage = await storage.createMessage(messageData);
      
      // Send message through WebSocket if recipient is connected
      const recipientId = req.user?.role === 'admin' ? newMessage.userId : newMessage.adminId;
      const recipientWs = connectedClients.get(recipientId);
      
      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify({
          type: 'message',
          message: newMessage
        }));
      }
      
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Mark messages as read
  app.patch('/api/messages/read', authMiddleware, async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      
      if (req.user?.role === 'admin' && !userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      await storage.markMessagesAsRead(userId || req.user?.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // ===== Contact & Testimonials Routes =====
  
  // Submit contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const newContact = await storage.createContact(contactData);
      res.status(201).json({ message: 'Contact form submitted successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get all contacts (admin only)
  app.get('/api/contacts', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update contact status (admin only)
  app.patch('/api/contacts/:id', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { isResolved } = req.body;
      
      const updatedContact = await storage.updateContactStatus(id, isResolved);
      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      
      res.json(updatedContact);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get approved testimonials
  app.get('/api/testimonials', async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get all testimonials (admin only)
  app.get('/api/admin/testimonials', adminMiddleware, async (_req: Request, res: Response) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Submit testimonial
  app.post('/api/testimonials', authMiddleware, async (req: Request, res: Response) => {
    try {
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        userId: req.user?.id
      });
      
      const newTestimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json({
        message: 'Testimonial submitted successfully. Pending approval.',
        testimonial: newTestimonial
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Approve testimonial (admin only)
  app.patch('/api/testimonials/:id/approve', adminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const approvedTestimonial = await storage.approveTestimonial(id);
      
      if (!approvedTestimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      res.json(approvedTestimonial);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  return httpServer;
}
