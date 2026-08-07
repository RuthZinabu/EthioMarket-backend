import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import { CartModel } from "@emacare/mongo/models";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 200, message: "Cart microservice is active" });
}

export async function getCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = await CartModel.create({
        userId,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      });
    }
    return res.json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { productId, name, price, quantity = 1, image } = req.body;

    if (!productId || !name || typeof price !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "productId, name, and numeric price are required" }, 400));
    }

    let cart = await CartModel.findOne({ userId });
    if (!cart) {
      cart = new CartModel({
        userId,
        items: [],
        totalPrice: 0,
        totalQuantity: 0,
      });
    }

    const existingIndex = cart.items.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, image });
    }

    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    return res.status(200).json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateItemQuantity(req: Request, res: Response) {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json(formatErrorResponse({ message: "quantity must be a non-negative number" }, 400));
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json(formatErrorResponse({ message: "Cart not found" }, 404));
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json(formatErrorResponse({ message: "Item not found in cart" }, 404));
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    return res.json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function removeItem(req: Request, res: Response) {
  try {
    const { userId, productId } = req.params;
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json(formatErrorResponse({ message: "Cart not found" }, 404));
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    return res.json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const cart = await CartModel.findOne({ userId });
    if (cart) {
      cart.items = [];
      cart.totalQuantity = 0;
      cart.totalPrice = 0;
      await cart.save();
    }
    return res.json(successResponse({ message: "Cart cleared successfully" }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export default {
  healthCheck,
  getCart,
  addToCart,
  updateItemQuantity,
  removeItem,
  clearCart,
};
