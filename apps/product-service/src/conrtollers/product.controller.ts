import type { Request, Response } from "express";
import { errorHandler, successResponse } from "@emacare/shared-utils";

type Product = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  stock?: number;
  image?: string;
  origin?: string;
};

// In-memory products store (dev)
const products: Product[] = [
  {
    id: "1",
    name: "Berbere Spice Mix",
    category: "spicy",
    description: "Traditional Ethiopian hot spice blend",
    price: 15.99,
    stock: 100,
    image: "berbere.jpg",
    origin: "Ethiopia",
  },
  {
    id: "2",
    name: "Ethiopian Honey",
    category: "honey",
    description: "Pure organic Ethiopian honey",
    price: 25.99,
    stock: 50,
    image: "honey.jpg",
    origin: "Ethiopia",
  },
  {
    id: "3",
    name: "Habesha Cotton Cloth",
    category: "cloth",
    description: "Traditional Habesha woven cloth",
    price: 45.99,
    stock: 30,
    image: "cloth.jpg",
    origin: "Ethiopia",
  },
  {
    id: "4",
    name: "Teff Flour",
    category: "food",
    description: "Nutritious Ethiopian grain flour",
    price: 12.99,
    stock: 75,
    image: "teff.jpg",
    origin: "Ethiopia",
  },
];

export function healthCheck(_req: Request, res: Response) {
  res.json({ status: "Product Service is running" });
}

export function getAllProducts(req: Request, res: Response) {
  try {
    const { category, search } = req.query;

    let filtered = products;

    if (typeof category === "string" && category.trim().length > 0) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (typeof search === "string" && search.trim().length > 0) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) =>
        (p.name || "").toLowerCase().includes(s),
      );
    }

    return res.json(successResponse(filtered));
  } catch (error) {
    return res.status(500).json(errorHandler(error));
  }
}

export function getProductById(req: Request, res: Response) {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json(errorHandler({ message: "Product not found" }));
    }

    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(errorHandler(error));
  }
}

export function createProduct(req: Request, res: Response) {
  try {
    const { name, category, description, price, stock, image, origin } = req.body || {};

    if (!name || !category) {
      return res.status(400).json(errorHandler({ message: "name and category are required" }));
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      category,
      description,
      price: typeof price === "number" ? price : undefined,
      stock: typeof stock === "number" ? stock : undefined,
      image,
      origin,
    };

    products.push(newProduct);
    return res.status(201).json(successResponse(newProduct, 201));
  } catch (error) {
    return res.status(500).json(errorHandler(error));
  }
}

export function updateInventory(req: Request, res: Response) {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json(errorHandler({ message: "Product not found" }));
    }

    const { stock } = req.body || {};

    if (typeof stock !== "number") {
      return res.status(400).json(errorHandler({ message: "stock must be a number" }));
    }

    product.stock = stock;
    return res.json(successResponse(product));
  } catch (error) {
    return res.status(500).json(errorHandler(error));
  }
}

export default {
  healthCheck,
  getAllProducts,
  getProductById,
  createProduct,
  updateInventory,
};

