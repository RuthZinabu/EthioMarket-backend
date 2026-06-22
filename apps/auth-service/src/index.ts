import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import { successResponse, errorHandler } from '@emacare/shared-utils';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(express.json());

// Mock user database
const users: any[] = [];

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Register endpoint
app.post('/register', async (req: express.Request<{}, {}, RegisterRequest>, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json(errorHandler({ message: 'Missing required fields' }));
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    };

    users.push(user);

    res.status(201).json(successResponse({ id: user.id, email: user.email, name: user.name }, 201));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Login endpoint
app.post('/login', async (req: express.Request<{}, {}, LoginRequest>, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json(errorHandler({ message: 'Invalid credentials' }));
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(errorHandler({ message: 'Invalid credentials' }));
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json(successResponse({ token, user: { id: user.id, email: user.email, name: user.name } }));
  } catch (error: any) {
    res.status(500).json(errorHandler(error));
  }
});

// Verify token endpoint
app.post('/verify', (req: express.Request, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json(errorHandler({ message: 'No token provided' }));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json(successResponse(decoded));
  } catch (error: any) {
    res.status(401).json(errorHandler(error));
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running' });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`);
});

export default app;
