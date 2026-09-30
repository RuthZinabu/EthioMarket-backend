import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import { Status } from "@emacare/mongo/types";
import cartService from "../services/cartService";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  SyncCartSchema,
} from "../validations/cartSchema";

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 200, message: "Cart microservice is active" });
}

export async function getCart(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId;
    if (!customerId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId is required" }, 400));
    }

    let cart = await cartService.getCartByCustomerId(customerId);
    if (!cart) {
      cart = await cartService.createCart(customerId);
    }
    return res.json(successResponse(cart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId || req.body.customerId;
    if (!customerId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId is required" }, 400));
    }

    const parseResult = AddToCartSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const productId = parseResult.data.productId || parseResult.data.item?.productId;
    const requestedQuantity = parseResult.data.quantity || parseResult.data.item?.quantity || 1;

    if (!productId) {
      return res.status(400).json(formatErrorResponse({ message: "productId is required" }, 400));
    }

    // ── Stock & Authoritative Product Validation ─────────────────────────
    const product = await cartService.getProductById(productId);
    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    if (!product.enabled || (product.status !== Status.APPROVED && product.status !== Status.ACTIVE)) {
      return res.status(400).json(formatErrorResponse({ message: "Product is currently unavailable for purchase" }, 400));
    }

    let cart = await cartService.getCartByCustomerId(customerId);
    if (!cart) {
      cart = await cartService.createCart(customerId);
    }

    if (!cart) {
      return res.status(500).json(formatErrorResponse({ message: "Failed to initialize cart" }, 500));
    }

    const items = cart.items || [];
    const existingIndex = items.findIndex((item: any) => item.productId === productId);
    const currentQty = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const newTotalQty = currentQty + requestedQuantity;

    if (newTotalQty > product.stock) {
      return res.status(400).json(
        formatErrorResponse(
          { message: `Insufficient stock. Only ${product.stock} items available (you have ${currentQty} in cart).` },
          400
        )
      );
    }

    const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

    if (existingIndex > -1) {
      items[existingIndex].quantity = newTotalQty;
      items[existingIndex].price = effectivePrice;
      items[existingIndex].name = product.name;
      if (product.vendorId) items[existingIndex].vendorId = String(product.vendorId);
      if (product.image) items[existingIndex].image = product.image;
    } else {
      items.push({
        productId,
        vendorId: product.vendorId ? String(product.vendorId) : undefined,
        name: product.name,
        price: effectivePrice,
        quantity: requestedQuantity,
        image: product.image,
      });
    }
    cart.items = items;

    const updatedCart = await cartService.saveCart(cart);
    return res.status(200).json(successResponse(updatedCart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateItemQuantity(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId;
    const { productId } = req.params;

    if (!customerId || !productId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId and productId are required" }, 400));
    }

    const parseResult = UpdateCartItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const { quantity } = parseResult.data;

    const cart = await cartService.getCartByCustomerId(customerId);
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
      const product = await cartService.getProductById(productId);
      if (product && quantity > product.stock) {
        return res.status(400).json(
          formatErrorResponse(
            { message: `Cannot update quantity. Only ${product.stock} items available.` },
            400
          )
        );
      }
      items[itemIndex].quantity = quantity;
    }
    cart.items = items;

    const updatedCart = await cartService.saveCart(cart);
    return res.json(successResponse(updatedCart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function removeItem(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId;
    const { productId } = req.params;

    if (!customerId || !productId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId and productId are required" }, 400));
    }

    const cart = await cartService.getCartByCustomerId(customerId);
    if (!cart) {
      return res.status(404).json(formatErrorResponse({ message: "Cart not found" }, 404));
    }

    cart.items = (cart.items || []).filter((item: any) => item.productId !== productId);
    const updatedCart = await cartService.saveCart(cart);
    return res.json(successResponse(updatedCart));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function clearCart(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId;
    if (!customerId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId is required" }, 400));
    }

    await cartService.clearCartByCustomerId(customerId);
    return res.json(successResponse({ message: "Cart cleared successfully" }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function syncCart(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId || req.params.userId || req.body.customerId;
    if (!customerId) {
      return res.status(400).json(formatErrorResponse({ message: "customerId is required" }, 400));
    }

    const parseResult = SyncCartSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    let cart = await cartService.getCartByCustomerId(customerId);
    if (!cart) {
      cart = await cartService.createCart(customerId);
    }

    if (!cart) {
      return res.status(500).json(formatErrorResponse({ message: "Failed to initialize cart" }, 500));
    }

    const existingItems = cart.items || [];
    const incomingItems = parseResult.data.items;

    for (const incoming of incomingItems) {
      const product = await cartService.getProductById(incoming.productId);
      if (!product || !product.enabled) continue;

      const effectivePrice = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
      const idx = existingItems.findIndex((item: any) => item.productId === incoming.productId);
      const requestedQty = incoming.quantity;

      if (idx > -1) {
        const totalQty = Math.min(product.stock, existingItems[idx].quantity + requestedQty);
        existingItems[idx].quantity = totalQty;
        existingItems[idx].price = effectivePrice;
      } else {
        const qty = Math.min(product.stock, requestedQty);
        existingItems.push({
          productId: incoming.productId,
          vendorId: product.vendorId ? String(product.vendorId) : undefined,
          name: product.name,
          price: effectivePrice,
          quantity: qty,
          image: product.image,
        });
      }
    }

    cart.items = existingItems;
    const updatedCart = await cartService.saveCart(cart);
    return res.json(successResponse(updatedCart));
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
  syncCart,
};
