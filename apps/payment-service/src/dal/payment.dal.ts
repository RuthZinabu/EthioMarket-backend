import { prisma, Payment, PaymentStatus, Currency, Prisma } from "@emacare/prisma";

export async function createPayment(data: Prisma.PaymentCreateInput): Promise<Payment> {
  return prisma.payment.create({
    data,
  });
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  return prisma.payment.findUnique({
    where: { id },
  });
}

export async function getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { orderId },
  });
}

export async function getPaymentsByCustomerId(customerId: string): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { customerId },
  });
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  paidDate?: Date
): Promise<Payment | null> {
  return prisma.payment.update({
    where: { id },
    data: {
      status,
      paidDate: paidDate || (status === PaymentStatus.COMPLETED ? new Date() : undefined),
    },
  });
}

export default {
  createPayment,
  getPaymentById,
  getPaymentsByOrderId,
  getPaymentsByCustomerId,
  updatePaymentStatus,
};
