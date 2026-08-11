import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import type { IProduct } from "@emacare/mongo/types";
import productDal from "../dal/product.dal";

export function healthCheck(_req: Request, res: Response) {
  res.json({ status: "Product Service is running" });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const { category, search, page, limit } = req.query;
    const filter: Record<string, any> = {};

    if (isNonEmptyString(category)) {
      filter.category = category;
    }

    if (isNonEmptyString(search)) {
      filter.name = { $regex: new RegExp(search, "i") };
    }

    if (page || limit) {
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const paginatedResult = await productDal.getProductsPaginated(filter, pageNum, limitNum);
      return res.json(successResponse(paginatedResult));
    }

    const products = await productDal.getProductsFiltered(filter);
    return res.json(successResponse(products));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id is required" }, 400));
    }

    const product = await productDal.getProductById(id);

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

    const product = await productDal.createProduct({
      ...payload,
      enabled: payload.enabled ?? true,
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
    const id = req.params.id;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id is required" }, 400));
    }

    const { stock } = req.body || {};

    if (typeof stock !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "stock must be a number" }, 400));
    }

    const product = await productDal.updateProduct(id, { stock, updatedAt: new Date() });

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
    const id = req.params.id;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id is required" }, 400));
    }

    const payload = req.body as Partial<IProduct>;

    if (payload.price !== undefined && typeof payload.price !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "price must be a number" }, 400));
    }

    if (payload.stock !== undefined && typeof payload.stock !== "number") {
      return res.status(400).json(formatErrorResponse({ message: "stock must be a number" }, 400));
    }

    const product = await productDal.updateProduct(id, {
      ...payload,
      updatedAt: new Date(),
    });

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
    const id = req.params.id;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id is required" }, 400));
    }

    const product = await productDal.softDeleteProduct(id);

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
