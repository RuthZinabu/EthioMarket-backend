import { cartRepository, productRepository } from "@emacare/mongo/repository";
import type { CartDocument, ProductDocument } from "@emacare/mongo/types";
import mongoose from "mongoose";

export class CartService {
  async getCartByCustomerId(customerId: string): Promise<CartDocument | null> {
    const result = await cartRepository.findOne({ customerId, isDeleted: { $ne: true } });
    return result ? result as CartDocument : null;
  }

  async createCart(customerId: string): Promise<CartDocument | null> {
    const result = await cartRepository.create({
      customerId,
      items: [],
      totalPrice: 0,
      totalQuantity: 0,
    });
    return result ? result as CartDocument : null;
  }

  async getProductById(productId: string): Promise<ProductDocument | null> {
    const filter = mongoose.Types.ObjectId.isValid(productId)
      ? { _id: new mongoose.Types.ObjectId(productId), isDeleted: { $ne: true } }
      : { sku: productId, isDeleted: { $ne: true } };
    const result = await productRepository.findOne(filter);
    return result ? result as ProductDocument : null;
  }

  async saveCart(cart: any): Promise<CartDocument | null> {
    const items = cart.items || [];
    const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price || 0) * item.quantity, 0);

    const result = await cartRepository.findOneAndUpdate(
      { _id: cart._id },
      {
        $set: {
          items,
          totalQuantity,
          totalPrice,
          updatedAt: new Date(),
        },
      }
    );
    return result ? result as CartDocument : null;
  }

  async clearCartByCustomerId(customerId: string): Promise<CartDocument | null> {
    const result = await cartRepository.findOneAndUpdate(
      { customerId, isDeleted: { $ne: true } } as any,
      {
        $set: {
          items: [],
          totalQuantity: 0,
          totalPrice: 0,
          updatedAt: new Date(),
        },
      }
    );
    return result ? result as CartDocument : null;
  }
}

export const cartService = new CartService();
export default cartService;
