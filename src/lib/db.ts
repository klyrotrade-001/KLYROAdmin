import fs from 'fs';
import path from 'path';
import { CustomerDetails, Product } from '@/src/types';

const siteConfig = {
  name: 'KLYRO',
  tagline: 'Quality Products, Trusted Delivery',
  whatsappNumber: '918089030066',
  whatsappDisplay: '+91 80890 30066',
  supportEmail: 'support@klyro.in',
  freeShippingThreshold: 499,
  standardShippingFee: 49,
};

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image: string;
  subtotal: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    message: string;
  }[];
}

export interface Inquiry {
  id: string;
  createdAt: string;
  type: 'general' | 'warranty' | 'support';
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Ensure data folder and files exist
function ensureFilesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    // Seed initial demo orders for tracking verification
    const initialOrders: Order[] = [
      {
        id: 'KLY-78241',
        createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: 'shipped',
        customer: {
          fullName: 'Sneha Nair',
          mobileNumber: '9876543210',
          email: 'sneha.nair@example.com',
          houseBuilding: 'Flat 304, Palm Grove Apartments',
          streetLocality: 'Kaloor Kadavanthra Road',
          city: 'Kochi',
          state: 'Kerala',
          pinCode: '682020',
          landmark: 'Opposite Metro Pillar 782',
        },
        items: [
          {
            productId: 'prod-1',
            name: 'Portable Mini Blender',
            price: 899,
            quantity: 1,
            variant: 'Sage Green',
            image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=80',
            subtotal: 899,
          },
        ],
        subtotal: 899,
        shippingFee: 0,
        totalAmount: 899,
        statusHistory: [
          {
            status: 'placed',
            timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
            message: 'Order placed via WhatsApp catalog',
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
            message: 'Payment and delivery address confirmed by KLYRO support',
          },
          {
            status: 'processing',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            message: 'Inspected, packaged in shockproof packaging',
          },
          {
            status: 'shipped',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            message: 'Dispatched with BlueDart Express. AWB #BLR92837482',
          },
        ],
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2));
  }

  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
  }

  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
  }
}

// Read helpers
export function getOrders(): Order[] {
  ensureFilesExist();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading orders file:', e);
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  ensureFilesExist();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  const cleanId = id.trim().toUpperCase();
  return orders.find((o) => o.id.toUpperCase() === cleanId);
}

export function getOrdersByPhone(phone: string): Order[] {
  const orders = getOrders();
  const cleanPhone = phone.replace(/\D/g, '');
  return orders.filter((o) => o.customer.mobileNumber.replace(/\D/g, '').includes(cleanPhone));
}

export function createOrder(data: {
  customer: CustomerDetails;
  items: {
    product: Product;
    quantity: number;
    selectedVariant?: string;
  }[];
}): { order: Order; whatsappUrl: string } {
  const orders = getOrders();

  // Generate unique order ID: KLY-XXXXX
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `KLY-${randomSuffix}`;

  const orderItems: OrderItem[] = data.items.map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    variant: item.selectedVariant,
    image: item.product.images[0],
    subtotal: item.product.price * item.quantity,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = subtotal >= siteConfig.freeShippingThreshold || subtotal === 0 ? 0 : siteConfig.standardShippingFee;
  const totalAmount = subtotal + shippingFee;

  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    createdAt: now,
    status: 'placed',
    customer: data.customer,
    items: orderItems,
    subtotal,
    shippingFee,
    totalAmount,
    statusHistory: [
      {
        status: 'placed',
        timestamp: now,
        message: 'Order initiated with delivery details',
      },
    ],
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  // Format the official WhatsApp order message with Order ID included
  const formatPrice = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;
  const lines = [
    `*NEW ORDER — ${siteConfig.name}*`,
    `_Order ID: *${orderId}*_`,
    `_Tagline: ${siteConfig.tagline}_`,
    "",
    "*Customer Details*",
    `Name: ${data.customer.fullName.trim()}`,
    `Mobile: ${data.customer.mobileNumber.trim()}`,
  ];

  if (data.customer.email?.trim()) {
    lines.push(`Email: ${data.customer.email.trim()}`);
  }

  lines.push(
    "",
    "*Delivery Address*",
    `${data.customer.houseBuilding.trim()}, ${data.customer.streetLocality.trim()}`,
    `${data.customer.city.trim()}, ${data.customer.state.trim()} - ${data.customer.pinCode.trim()}`
  );

  if (data.customer.landmark?.trim()) {
    lines.push(`Landmark: ${data.customer.landmark.trim()}`);
  }
  if (data.customer.orderNotes?.trim()) {
    lines.push(`Order Notes: ${data.customer.orderNotes.trim()}`);
  }

  lines.push("", "*Order Items*");
  orderItems.forEach((item, index) => {
    const variantText = item.variant ? ` [${item.variant}]` : '';
    lines.push(
      `${index + 1}. ${item.name}${variantText} (Qty: ${item.quantity}) — ${formatPrice(item.price)} each = *${formatPrice(item.subtotal)}*`
    );
  });

  lines.push(
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    `Shipping: ${shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}`,
    `*Total Payable: ${formatPrice(totalAmount)}*`,
    "",
    `Please confirm my Order *#${orderId}* and share estimated delivery timeline.`
  );

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;

  return { order: newOrder, whatsappUrl };
}

export function updateOrderStatus(orderId: string, status: OrderStatus, message?: string): Order | null {
  const orders = getOrders();
  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase());
  if (!order) return null;

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    message: message || `Status updated to ${status}`,
  });

  saveOrders(orders);
  return order;
}

// Inquiries
export function saveInquiry(data: Omit<Inquiry, 'id' | 'createdAt'>): Inquiry {
  ensureFilesExist();
  const raw = fs.readFileSync(INQUIRIES_FILE, 'utf8');
  const inquiries: Inquiry[] = JSON.parse(raw);

  const inquiry: Inquiry = {
    ...data,
    id: `INQ-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };

  inquiries.unshift(inquiry);
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  return inquiry;
}

// Newsletter
export function saveSubscriber(email: string): { success: boolean; message: string } {
  ensureFilesExist();
  const cleanEmail = email.trim().toLowerCase();
  const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
  const subscribers: Subscriber[] = JSON.parse(raw);

  if (subscribers.some((s) => s.email === cleanEmail)) {
    return { success: true, message: 'You are already subscribed to KLYRO updates.' };
  }

  subscribers.push({
    email: cleanEmail,
    subscribedAt: new Date().toISOString(),
  });

  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
  return { success: true, message: 'Thank you for subscribing to KLYRO updates!' };
}

