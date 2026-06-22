# Development Dependencies Installation Guide

## Prerequisites
- Node.js v18.x or higher
- Yarn package manager
- Git

## Installation Steps

### 1. Install Root Dependencies
```bash
yarn install
```

### 2. Install Monorepo Dependencies
Dependencies are automatically resolved through yarn workspaces. Each service has:
- Core dependencies: Express, TypeScript, dotenv
- Service-specific: Mongoose (DB), Redis, Stripe, etc.

### 3. Common Development Dependencies

**Required for all services:**
- `express` - Web framework
- `typescript` - Type checking
- `dotenv` - Environment variables
- `ts-node` - TypeScript execution

**Optional Development Tools:**
```bash
# For better development experience
yarn add -W -D nodemon    # Auto-reload on file changes
yarn add -W -D jest       # Testing framework
yarn add -W -D prettier   # Code formatting
```

### 4. Quick Start

```bash
# Copy environment file
cp .env.example .env

# Install all dependencies
yarn install

# Start all services
yarn dev

# Or start individual service
yarn workspace @emacare/auth-service dev
```

### 5. Build Production

```bash
# Build all services
yarn build

# Build specific service
yarn workspace @emacare/product-service build

# Start service
yarn workspace @emacare/product-service start
```

## Troubleshooting

### Port already in use
If a port is already in use:
```bash
# Kill process on port (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3010
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
yarn install
```

### TypeScript errors
```bash
# Clear TypeScript cache
rm -rf dist/
yarn build
```

## Service Ports
- API Gateway: 3000
- Auth Service: 3001
- Product Service: 3002
- Order Service: 3003
- Cart Service: 3004
- Payment Service: 3005
- Shipping Service: 3006
- Notification Service: 3007
