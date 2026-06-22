import express from 'express';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Mock product database
const products = [
  {
    id: '1',
    name: 'Berbere Spice Mix',
    category: 'spicy',
    description: 'Traditional Ethiopian hot spice blend',
    price: 15.99,
    stock: 100,
    image: 'berbere.jpg',
    origin: 'Ethiopia',
  },
  {
    id: '2',
    name: 'Ethiopian Honey',
    category: 'honey',
    description: 'Pure organic Ethiopian honey',
    price: 25.99,
    stock: 50,
    image: 'honey.jpg',
    origin: 'Ethiopia',
  },
  {
    id: '3',
    name: 'Habesha Cotton Cloth',
    category: 'cloth',
    description: 'Traditional Habesha woven cloth',
    price: 45.99,
    stock: 30,
    image: 'cloth.jpg',
    origin: 'Ethiopia',
  },
  {
    id: '4',
    name: 'Teff Flour',
    category: 'food',
    description: 'Nutritious Ethiopian grain flour',
    price: 12.99,
    stock: 75,
    image: 'teff.jpg',
    origin: 'Ethiopia',
  },
];

// Get all products
app.get('/', (req, res) => {
  try {
    const { category, search } = req.query;

    let filtered = products;

    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    res.json(successResponse(filtered));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Get product by ID
app.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json(errorHandler({ message: 'Product not found' }));
    }

    res.json(successResponse(product));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Create product (admin)
app.post('/', (req, res) => {
  try {
    const { name, category, description, price, stock, image, origin } = req.body;

    const newProduct = {
      id: Date.now().toString(),
      name,
      category,
      description,
      price,
      stock,
      image,
      origin,
    };

    products.push(newProduct);
    res.status(201).json(successResponse(newProduct, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Update product inventory
app.patch('/:id/inventory', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json(errorHandler({ message: 'Product not found' }));
    }

    const { stock } = req.body;
    product.stock = stock;

    res.json(successResponse(product));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Product Service is running' });
});

app.listen(PORT, () => {
  console.log(`📦 Product Service running on http://localhost:${PORT}`);
});

export default app;
