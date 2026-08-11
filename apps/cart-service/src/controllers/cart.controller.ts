import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import cartDal from "../dal/cart.dal";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 200, message: "Cart microservice is active" });
}

export async function getCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    let cart = await cartDal.getCartByUserId(userId);
    if (!cart) {
      cart = await cartDal.createCart(userId);
    }
    return res.json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { productId, vendorId, name, price, quantity = 1, image } = req.body;

    if (!productId || !name || typeof price !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "productId, name, and numeric price are required" }, 400));
    }

    let cart = await cartDal.getCartByUserId(userId);
    if (!cart) {
      cart = await cartDal.createCart(userId);
    }

    if (!cart) {
      return res.status(500).json(formatErrorResponse({ message: "Failed to initialize cart" }, 500));
    }

    const items = cart.items || [];
    const existingIndex = items.findIndex((item: any) => item.productId === productId);
    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ productId, vendorId, name, price, quantity, image });
    }
    cart.items = items;

    const updatedCart = await cartDal.saveCart(cart);
    return res.status(200).json(successResponse(updatedCart));
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

    const cart = await cartDal.getCartByUserId(userId);
    if (!cart) {
      return res.status(404).json(formatErrorResponse({ message: "Cart not found" }, 404));
    }

    const items = cart.items || [];
    const itemIndex = items.findIndex((item: any) => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json(formatErrorResponse({ message: "Item not found in cart" }, 404));
    }

    if (quantity === 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }
    cart.items = items;

    const updatedCart = await cartDal.saveCart(cart);
    return res.json(successResponse(updatedCart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function removeItem(req: Request, res: Response) {
  try {
    const { userId, productId } = req.params;
    const cart = await cartDal.getCartByUserId(userId);
    if (!cart) {
      return res.status(404).json(formatErrorResponse({ message: "Cart not found" }, 404));
    }

    cart.items = (cart.items || []).filter((item: any) => item.productId !== productId);
    const updatedCart = await cartDal.saveCart(cart);
    return res.json(successResponse(updatedCart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    await cartDal.clearCartByUserId(userId);
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
