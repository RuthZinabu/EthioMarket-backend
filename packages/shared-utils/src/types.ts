// Shared types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface AuthToken {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Product {
  id: string;
  name: string;
  category: string; // food, spicy, honey, cloth, etc.
  description: string;
  price: number;
  stock: number;
  image: string;
  origin: string; // Habesha region
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingDetails {
  carrier: 'DHL' | 'FedEx' | 'UPS';
  trackingNumber: string;
  estimatedDelivery: Date;
  currentStatus: string;
}
