import type { Request, Response } from 'express';
import { errorHandler, successResponse } from '@emacare/shared-utils';
import { CartItem } from '../types/cart.types';

type Cart = { items: CartItem[]; total: number };

// In-memory storage (replace with Redis/db later)
const carts: Map<string, Cart> = new Map();

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 200, message: 'Cart microservice service is active' });
}

export function getCart(req: Request<{ userId: string }>, res: Response) {
  try {
    const cart = carts.get(req.params.userId) || { items: [], total: 0 };
    return res.json(successResponse(cart));
  } catch (err) {
    return res.status(500).json(errorHandler(err));
  }
}

export function addItem(
  req: Request<{ userId: string }, {}, CartItem>,
  res: Response,
) {
  try {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;

    let cart = carts.get(userId);
    if (!cart) cart = { items: [], total: 0 };

    const existing = cart.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price });
    }

    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    carts.set(userId, cart);

    return res.json(successResponse(cart));
  } catch (err) {
    return res.status(500).json(errorHandler(err));
  }
}

export function removeItem(
  req: Request<{ userId: string; productId: string }>,
  res: Response,
) {
  try {
    const cart = carts.get(req.params.userId);
    if (!cart) {
      return res.status(404).json(errorHandler({ message: 'Cart not found' }));
    }

    cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    carts.set(req.params.userId, cart);
    return res.json(successResponse(cart));
  } catch (err) {
    return res.status(500).json(errorHandler(err));
  }
}

export function clearCart(req: Request<{ userId: string }>, res: Response) {
  try {
    carts.delete(req.params.userId);
    return res.json(successResponse({ message: 'Cart cleared' }));
  } catch (err) {
    return res.status(500).json(errorHandler(err));
  }
}

export default {
  healthCheck,
  getCart,
  addItem,
  removeItem,
  clearCart,
};

