import { cartRepository } from "@emacare/mongo/repository";

export async function getCartByUserId(userId: string): Promise<any> {
  return cartRepository.findOne({ $or: [{ customerId: userId }, { userId }] } as any);
}

export async function createCart(userId: string): Promise<any> {
  return cartRepository.create({
    customerId: userId,
    userId,
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  } as any);
}

export async function saveCart(cart: any): Promise<any> {
  const items = cart.items || [];
  const totalQuantity = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return cartRepository.findOneAndUpdate(
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
}

export async function clearCartByUserId(userId: string): Promise<any> {
  return cartRepository.findOneAndUpdate(
    { $or: [{ customerId: userId }, { userId }] } as any,
    {
      $set: {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        updatedAt: new Date(),
      },
    }
  );
}

export default {
  getCartByUserId,
  createCart,
  saveCart,
  clearCartByUserId,
};
