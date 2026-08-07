import type { Request, Response } from "express";
import mongoose from "mongoose";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import type { IProduct } from "@emacare/mongo/types";
import { ProductModel } from "@emacare/mongo/models";

export function healthCheck(_req: Request, res: Response) {
  res.json({ status: "Product Service is running" });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function parseMongoId(id: string) {
  if (!id || typeof id !== "string") return null;
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { category, search } = req.query;
    const filter: Record<string, any> = { isDeleted: false };

    if (isNonEmptyString(category)) {
      filter.category = category;
    }

    if (isNonEmptyString(search)) {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    const products = await ProductModel.find(filter).sort({ createdAt: -1 });
    return res.json(successResponse(products));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const mongoId = parseMongoId(req.params.id);
    if (!mongoId) {
      return res.status(400).json(formatErrorResponse({ message: "Invalid product id" }, 400));
    }

    const product = await ProductModel.findOne({ _id: mongoId, isDeleted: false });

    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const payload = req.body as Partial<IProduct>;
    const name = payload.name;
    const category = payload.category;

    if (!name || !category) {
      return res.status(400).json(formatErrorResponse({ message: "name and category are required" }, 400));
    }

    const product = await ProductModel.create({
      ...payload,
      enabled: payload.enabled ?? true,
      isDeleted: false,
      name,
      category,
    });

    return res.status(201).json(successResponse(product, 201));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateInventory(req: Request, res: Response) {
  try {
    const mongoId = parseMongoId(req.params.id);
    if (!mongoId) {
      return res.status(400).json(formatErrorResponse({ message: "Invalid product id" }, 400));
    }

    const { stock } = req.body || {};

    if (typeof stock !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "stock must be a number" }, 400));
    }

    const product = await ProductModel.findOneAndUpdate(
      { _id: mongoId, isDeleted: false },
      { $set: { stock, updatedAt: new Date() } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const mongoId = parseMongoId(req.params.id);
    if (!mongoId) {
      return res.status(400).json(formatErrorResponse({ message: "Invalid product id" }, 400));
    }

    const payload = req.body as Partial<IProduct>;

    if (payload.price !== undefined && typeof payload.price !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "price must be a number" }, 400));
    }

    if (payload.stock !== undefined && typeof payload.stock !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "stock must be a number" }, 400));
    }

    const product = await ProductModel.findOneAndUpdate(
      { _id: mongoId, isDeleted: false },
      {
        $set: {
          ...payload,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const mongoId = parseMongoId(req.params.id);
    if (!mongoId) {
      return res.status(400).json(formatErrorResponse({ message: "Invalid product id" }, 400));
    }

    const product = await ProductModel.findOneAndUpdate(
      { _id: mongoId, isDeleted: false },
      { $set: { isDeleted: true, updatedAt: new Date() } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export default {
  healthCheck,
  getAllProducts,
  getProductById,
  createProduct,
  updateInventory,
  updateProduct,
  deleteProduct,
};



