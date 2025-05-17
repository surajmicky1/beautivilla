import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  products, type Product, type InsertProduct,
  appointments, type Appointment, type InsertAppointment,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  messages, type Message, type InsertMessage,
  contacts, type Contact, type InsertContact,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAdmins(): Promise<User[]>;

  // Service methods
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Appointment methods
  getAppointments(): Promise<Appointment[]>;
  getUserAppointments(userId: number): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<{order: Order, items: OrderItem[]} | undefined>;

  // Order items methods
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;

  // Message methods
  getMessages(userId: number): Promise<Message[]>;
  getUserMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(userId: number): Promise<boolean>;

  // Contact methods
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: number, isResolved: boolean): Promise<Contact | undefined>;

  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private products: Map<number, Product>;
  private appointments: Map<number, Appointment>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private messages: Map<number, Message>;
  private contacts: Map<number, Contact>;
  private testimonials: Map<number, Testimonial>;
  
  currentUserId: number;
  currentServiceId: number;
  currentProductId: number;
  currentAppointmentId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  currentMessageId: number;
  currentContactId: number;
  currentTestimonialId: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.products = new Map();
    this.appointments = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.messages = new Map();
    this.contacts = new Map();
    this.testimonials = new Map();
    
    this.currentUserId = 1;
    this.currentServiceId = 1;
    this.currentProductId = 1;
    this.currentAppointmentId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentMessageId = 1;
    this.currentContactId = 1;
    this.currentTestimonialId = 1;

    // Initialize with demo data
    this.initDemoData();
  }

  private initDemoData() {
    // Create admin user
    this.createUser({
      name: 'Admin User',
      email: 'Admin@beautyvilla.com',
      password: '$2b$10$lhb.AX0O9i19CrXi1r3EHunSCH33xpLi2x.To2EOo.5LARdX7NaD2', // 'Admin@123'
      role: 'admin'
    });

    // Create regular user
    this.createUser({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '$2b$10$hACwlrj.13VsrU3Bj/MGQOB0XnZ1hNZHqIaYjPnCJc8kDiTtK7e3S', // 'password123'
      role: 'user'
    });

    // Create services
    const services = [
      {
        name: 'Hair Styling',
        description: 'Expert styling services including cuts, coloring, highlights, and specialized treatments.',
        price: 45.00,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      },
      {
        name: 'Facial Treatments',
        description: 'Rejuvenate your skin with our signature facials designed for various skin types and concerns.',
        price: 65.00,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      },
      {
        name: 'Nail Services',
        description: 'Complete nail care with manicures, pedicures, gel polishes, and artistic nail designs.',
        price: 35.00,
        duration: 45,
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      },
      {
        name: 'Makeup Application',
        description: 'Professional makeup for any occasion, from daily wear to special events.',
        price: 55.00,
        duration: 60,
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      },
      {
        name: 'Body Massage',
        description: 'Relaxing and therapeutic massage techniques to relieve stress and tension.',
        price: 75.00,
        duration: 90,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      },
      {
        name: 'Waxing',
        description: 'Full body and facial waxing services using premium quality products.',
        price: 30.00,
        duration: 30,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        isActive: true
      }
    ];

    services.forEach(service => this.createService(service));

    // Create products
    const products = [
      {
        name: 'Luxury Facial Serum',
        description: 'Hydrating facial serum with hyaluronic acid and vitamin C for glowing skin.',
        brand: 'Beauty Villa Collection',
        price: 49.99,
        image: 'https://pixabay.com/get/g6c7f866b4bfb1f85e9662aa15c892d70757872254a16c5f79e043a555930d7049be3dea1e15dabdff710c6f9f5a409e691b0641e0032d3038770cad903637625_1280.jpg',
        stock: 50,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Premium Hair Care Set',
        description: 'Complete set with shampoo, conditioner, and treatment for damaged hair.',
        brand: 'EliteHair',
        price: 75.00,
        image: 'https://pixabay.com/get/g2bb6a02ae30cd0085f42ad421c85ded4030b3a974f1efa45cd20088c1c406277f49660efbd454ab81899844e69414efbd38330ff93b9287b267442bd0478d70e_1280.jpg',
        stock: 30,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Professional Makeup Brushes',
        description: '10-piece professional brush set for flawless makeup application.',
        brand: 'ArtistChoice',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        stock: 25,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Luxury Perfume',
        description: 'Captivating fragrance with notes of jasmine, rose, and amber.',
        brand: 'Essence of Beauty',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        stock: 20,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Revitalizing Face Mask',
        description: 'Deep-cleansing mask that removes impurities and brightens complexion.',
        brand: 'Beauty Villa Collection',
        price: 35.50,
        image: 'https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        stock: 40,
        isActive: true,
        isFeatured: false
      },
      {
        name: 'Nail Polish Collection',
        description: 'Set of 6 seasonal colors in long-lasting, chip-resistant formula.',
        brand: 'ColorGlow',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1631214240010-a1a9d0e4b1a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400',
        stock: 35,
        isActive: true,
        isFeatured: false
      }
    ];

    products.forEach(product => this.createProduct(product));

    // Create testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        role: 'Regular Client',
        content: 'The hair treatment I received was amazing! My hair has never felt so healthy and looked so vibrant. The staff was professional and friendly.',
        rating: 5,
        userId: 2,
        isApproved: true
      },
      {
        name: 'Michael Davis',
        role: 'New Customer',
        content: 'I\'ve tried many facial treatments but none compare to Beauty Villa\'s signature facial. My skin looks years younger and the ambiance was so relaxing!',
        rating: 5,
        userId: null,
        isApproved: true
      },
      {
        name: 'Emily Wilson',
        role: 'Regular Customer',
        content: 'The products I purchased were top quality and gave me amazing results. The online ordering process was simple and delivery was fast. Will shop again!',
        rating: 4,
        userId: null,
        isApproved: true
      }
    ];

    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getAdmins(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === 'admin');
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: number, serviceData: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceData };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isFeatured);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Appointment methods
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getUserAppointments(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentAppointmentId++;
    const createdAt = new Date();
    const appointment: Appointment = { ...insertAppointment, id, createdAt };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, status };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt, updatedAt };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { 
      ...order, 
      status,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getOrderWithItems(id: number): Promise<{order: Order, items: OrderItem[]} | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const items = await this.getOrderItems(id);
    return { order, items };
  }

  // Order items methods
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (orderItem) => orderItem.orderId === orderId
    );
  }

  // Message methods
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId || message.adminId === userId
    );
  }

  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(userId: number): Promise<boolean> {
    const userMessages = Array.from(this.messages.values()).filter(
      (message) => message.userId === userId && !message.isRead
    );
    
    userMessages.forEach(message => {
      const updatedMessage = { ...message, isRead: true };
      this.messages.set(message.id, updatedMessage);
    });
    
    return true;
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const createdAt = new Date();
    const isResolved = false;
    const contact: Contact = { ...insertContact, id, createdAt, isResolved };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactStatus(id: number, isResolved: boolean): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact = { ...contact, isResolved };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.isApproved
    );
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const createdAt = new Date();
    const isApproved = insertTestimonial.isApproved || false;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      createdAt,
      isApproved
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, isApproved: true };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
}

export const storage = new MemStorage();
