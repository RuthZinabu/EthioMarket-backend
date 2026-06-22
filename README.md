# EmaCAre Platform - E-Commerce Monorepo

EmaCAre is a modern microservices-based e-commerce platform designed to sell authentic Habesha (Ethiopian) products including food, spices, honey, and traditional cloth to diaspora communities worldwide. Built with Node.js, Express, and TypeScript in a monorepo structure.

## 🏗️ Project Structure

```
emacare-platform/
├── apps/                          # Microservices
│   ├── api-gateway/              # Central API Gateway (Port 3000)
│   ├── auth-service/             # Authentication & User Management (Port 3001)
│   ├── product-service/          # Product Catalog & Inventory (Port 3002)
│   ├── order-service/            # Order Management (Port 3003)
│   ├── cart-service/             # Shopping Cart Service (Port 3004)
│   ├── payment-service/          # Payment Processing (Port 3005)
│   ├── shipping-service/         # DHL Shipping Integration (Port 3006)
│   └── notification-service/     # Email & SMS Notifications (Port 3007)
├── packages/
│   └── shared-utils/             # Shared types, utilities, and helpers
├── docker-compose.yml            # Docker orchestration
├── package.json                  # Root package manager configuration
└── README.md                     # This file
```

## 🎯 Core Microservices

### 1. **API Gateway** (Port 3000)
- Central entry point for all client requests
- Routes requests to appropriate microservices
- Health check endpoint
- CORS support

**Key Endpoints:**
- `GET /health` - Gateway health status

### 2. **Auth Service** (Port 3001)
- User registration and login
- JWT token generation and verification
- User authentication middleware

**Key Endpoints:**
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify` - Token verification

### 3. **Product Service** (Port 3002)
- Product catalog management
- Inventory tracking
- Product filtering by category (food, spicy, honey, cloth)
- Search functionality

**Key Endpoints:**
- `GET /` - List all products
- `GET /:id` - Get product details
- `POST /` - Create new product
- `PATCH /:id/inventory` - Update inventory

### 4. **Order Service** (Port 3003)
- Order creation and management
- Order status tracking
- Order history retrieval

**Key Endpoints:**
- `POST /` - Create order
- `GET /:id` - Get order details
- `GET /user/:userId` - Get user orders
- `PATCH /:id/status` - Update order status

### 5. **Cart Service** (Port 3004)
- Shopping cart management
- Item add/remove functionality
- Cart persistence (Redis-backed)

**Key Endpoints:**
- `GET /:userId` - Get user cart
- `POST /:userId/items` - Add item to cart
- `DELETE /:userId/items/:productId` - Remove item
- `DELETE /:userId` - Clear cart

### 6. **Payment Service** (Port 3005)
- Payment processing
- Stripe integration (ready for production)
- Transaction history
- Payment verification

**Key Endpoints:**
- `POST /process` - Process payment
- `GET /:paymentId` - Get payment details
- `GET /order/:orderId` - Get order payments

### 7. **Shipping Service** (Port 3006)
- DHL shipment integration
- Real-time tracking
- Estimated delivery dates
- Shipment status updates

**Key Endpoints:**
- `POST /` - Create shipment
- `GET /track/:trackingNumber` - Track shipment
- `GET /order/:orderId` - Get order shipment
- `PATCH /:id/status` - Update shipment status

### 8. **Notification Service** (Port 3007)
- Email notifications (via Nodemailer/Gmail)
- SMS notifications (via Twilio)
- Order confirmations
- Shipment updates

**Key Endpoints:**
- `POST /email` - Send email
- `POST /sms` - Send SMS
- `POST /order-confirmation` - Send order confirmation
- `POST /shipment-update` - Send shipment update

### 9. **Shared Utils Package**
- TypeScript interfaces and types
- API client utilities
- Helper functions
- Centralized error handling

## 📋 Prerequisites

- **Node.js** >= 18.x
- **Yarn** >= 1.22.x (or npm)
- **Docker** & **Docker Compose** (for containerized deployment)
- **MongoDB** (for database)
- **Redis** (for cart service caching)

## 🚀 Getting Started

### Local Development Setup

1. **Clone and navigate to project:**
```bash
cd ETHIO-MARKET-PLACE
```

2. **Install dependencies:**
```bash
yarn install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Update `.env` with your configuration:**
```bash
# Configure API keys and database URLs
# - Update JWT_SECRET
# - Add DHL API credentials
# - Configure Stripe keys
# - Set up email credentials
# - Add Twilio credentials
```

5. **Start all services in development mode:**
```bash
yarn dev
```

This command starts all microservices concurrently in watch mode.

### Individual Service Development

Start specific services:

```bash
# Auth Service
yarn workspace @emacare/auth-service dev

# Product Service
yarn workspace @emacare/product-service dev

# Order Service
yarn workspace @emacare/order-service dev

# Payment Service
yarn workspace @emacare/payment-service dev
```

## 🐳 Docker Deployment

### Start all services with Docker Compose:

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

### Access services:
- **API Gateway**: http://localhost:3000
- **Auth Service**: http://localhost:3001
- **Product Service**: http://localhost:3002
- **Order Service**: http://localhost:3003
- **Cart Service**: http://localhost:3004
- **Payment Service**: http://localhost:3005
- **Shipping Service**: http://localhost:3006
- **Notification Service**: http://localhost:3007
- **MongoDB**: mongodb://localhost:27017
- **Redis**: redis://localhost:6379

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure_password"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/user-123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "1",
    "quantity": 2,
    "price": 15.99
  }'
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "items": [
      {"productId": "1", "quantity": 2, "price": 15.99}
    ],
    "totalAmount": 31.98,
    "shippingAddress": "123 Main St, Addis Ababa, Ethiopia"
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:3000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "amount": 31.98,
    "currency": "USD",
    "paymentMethod": "stripe"
  }'
```

### Track Shipment
```bash
curl http://localhost:3000/api/shipping/track/DHL123456
```

## 🔧 Building and Compilation

### Build all services:
```bash
yarn build
```

### Build specific service:
```bash
yarn workspace @emacare/auth-service build
```

## 🧪 Testing

### Run tests for all services:
```bash
yarn test
```

### Run tests for specific service:
```bash
yarn workspace @emacare/product-service test
```

## 📦 Adding Dependencies

### Add to root workspace:
```bash
yarn add -W package-name
```

### Add to specific service:
```bash
yarn workspace @emacare/auth-service add package-name
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Environment variable configuration
- Request validation
- Error handling middleware

## 🚢 Deployment Considerations

1. **Environment Setup:**
   - Use separate `.env` files for staging and production
   - Rotate JWT secrets regularly
   - Use strong database credentials

2. **Scaling:**
   - Use load balancers in front of API Gateway
   - Deploy services independently for better scaling
   - Use managed databases (MongoDB Atlas, AWS RDS)
   - Implement Redis cluster for cart service

3. **Monitoring:**
   - Add logging service (ELK Stack, Datadog)
   - Set up health check endpoints
   - Monitor service performance
   - Set up alerts for failures

4. **CI/CD:**
   - Set up GitHub Actions for automated builds
   - Run tests before deployment
   - Automated Docker image builds and pushes
   - Implement blue-green deployments

## 📚 Key Technologies

| Service | Technology | Purpose |
|---------|-----------|---------|
| Runtime | Node.js | JavaScript runtime |
| Framework | Express | Web framework |
| Language | TypeScript | Type safety |
| Database | MongoDB | Document storage |
| Cache | Redis | Session & cart storage |
| Auth | JWT + bcryptjs | Authentication |
| Payments | Stripe | Payment processing |
| Shipping | DHL API | Logistics |
| Emails | Nodemailer | Email notifications |
| SMS | Twilio | SMS notifications |
| Container | Docker | Containerization |
| Orchestration | Docker Compose | Multi-container management |

## 📋 Configuration Files

- `.env.example` - Environment variable template
- `docker-compose.yml` - Docker services orchestration
- `tsconfig.json` - TypeScript configuration
- `Dockerfile` - Per-service Docker configuration

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues, questions, or suggestions, please contact:
- Email: support@emacare.com
- Issues: GitHub Issues

## 🎯 Roadmap

- [ ] Admin dashboard
- [ ] Customer reviews and ratings
- [ ] Recommendation engine
- [ ] Multi-language support (Amharic, English)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Loyalty program
- [ ] Wishlist feature

---

**Built with ❤️ for the Habesha diaspora community**
