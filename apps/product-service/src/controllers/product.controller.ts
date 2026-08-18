import type { Request, Response } from "express";
import { formatErrorResponse, successResponse } from "@emacare/shared-utils";
import { Status } from "@emacare/mongo/types";
import productDal from "../dal/product.dal";
import vendorDal from "../dal/vendor.dal";
import {
  CreateProductSchema,
  UpdateProductSchema,
  ApproveProductSchema,
  ProductQuerySchema,
} from "../validations/productSchema";
import { ExpressFile, handleProductImageUploads, uploadFileToSeaweed} from "../utils/uploadFile";

export function healthCheck(_req: Request, res: Response) {
  res.json({ status: "Product Service is running" });
}


export async function createProduct(req: Request, res: Response) {
  try {
    const body = { ...req.body };
    await handleProductImageUploads(req, body);

    const parseResult = CreateProductSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const vendor = await vendorDal.getVendorById(parseResult.data.vendorId);
    if (!vendor) {
      return res.status(404).json(
        formatErrorResponse({ message: "Vendor does not exist" }, 404)
      );
    }

    const product = await productDal.createProduct(parseResult.data as any);
    return res.status(201).json(successResponse(product, 201));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function uploadProductAsset(req: Request, res: Response) {
  try {
    const file = req.file as ExpressFile | undefined;
    if (!file) {
      return res.status(400).json(formatErrorResponse({ message: "No file uploaded" }, 400));
    }
    const fileUrl = await uploadFileToSeaweed(file, "product_asset");
    return res.json(successResponse({ fileUrl }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}


export async function getAllProducts(req: Request, res: Response) {
  try {
    const parseResult = ProductQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Invalid query parameters", errors: parseResult.error.issues },
          400
        )
      );
    }

    const { category, vendorId, search, minPrice, maxPrice, status, page = 1, limit = 10 } = parseResult.data;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.status = status;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { sku: { $regex: new RegExp(search, "i") } },
      ];
    }

    const paginatedResult = await productDal.getProductsPaginated(filter, page, limit);
    return res.json(successResponse(paginatedResult));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id or sku is required" }, 400));
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

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id or sku is required" }, 400));
    }

    const body = { ...req.body };
    await handleProductImageUploads(req, body);

    const parseResult = UpdateProductSchema.safeParse(body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    if (parseResult.data.vendorId) {
      const vendor = await vendorDal.getVendorById(parseResult.data.vendorId);
      if (!vendor) {
        return res.status(404).json(
          formatErrorResponse({ message: "Vendor does not exist" }, 404)
        );
      }
    }

    const updatedProduct = await productDal.updateProduct(id, {
      ...(parseResult.data as any),
      updatedAt: new Date(),
    });

    if (!updatedProduct) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(updatedProduct));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function updateInventory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id or sku is required" }, 400));
    }

    const parseResult = UpdateProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    if (parseResult.data.stock === undefined) {
      return res.status(400).json(formatErrorResponse({ message: "stock is required" }, 400));
    }

    const product = await productDal.updateProduct(id, { stock: parseResult.data.stock, updatedAt: new Date() });
    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export async function approveProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id or sku is required" }, 400));
    }

    const parseResult = ApproveProductSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(
        formatErrorResponse(
          { message: "Validation failed", errors: parseResult.error.issues },
          400
        )
      );
    }

    const { status, rejectedReason, approvedBy } = parseResult.data;
    const updateData: Record<string, any> = {
      status,
      enabled: status === Status.APPROVED,
      updatedAt: new Date(),
    };

    if (status === Status.APPROVED) {
      updateData.approvedAt = new Date();
      if (approvedBy) {
        updateData.approvedBy = approvedBy;
      }
    } else if (status === Status.REJECTED) {
      updateData.rejectedReason = rejectedReason;
    }

    const product = await productDal.updateProduct(id, updateData);
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
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(formatErrorResponse({ message: "Product id or sku is required" }, 400));
    }

    const product = await productDal.softDeleteProduct(id);
    if (!product) {
      return res.status(404).json(formatErrorResponse({ message: "Product not found" }, 404));
    }

    return res.json(successResponse({ message: "Product deleted successfully" }));
  } catch (error) {
    return res.status(500).json(formatErrorResponse(error));
  }
}

export default {
  healthCheck,
  uploadProductAsset,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateInventory,
  approveProduct,
  deleteProduct,
};
