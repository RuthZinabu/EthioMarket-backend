# EmaCAre Copilot Instructions

This is a Node.js Express monorepo for the EmaCAre e-commerce platform selling Habesha products.

## Project Structure
- **apps/** - Individual microservices (API Gateway, Auth, Product, Order, Cart, Payment, Shipping, Notification)
- **packages/** - Shared utilities and types
- **docker-compose.yml** - Multi-container orchestration
- **.env.example** - Environment configuration template

## Quick Start
1. `yarn install` - Install all dependencies
2. `cp .env.example .env` - Create environment file
3. `yarn dev` - Start all services
4. Access API Gateway at http://localhost:3000

## Available Commands
- `yarn dev` - Start all services in development mode
- `yarn build` - Build all services
- `yarn test` - Run tests
- `docker-compose up` - Start with Docker

## Key Services
- **API Gateway (3000)** - Central entry point
- **Auth Service (3001)** - User authentication
- **Product Service (3002)** - Product catalog
- **Order Service (3003)** - Order management
- **Cart Service (3004)** - Shopping cart
- **Payment Service (3005)** - Stripe integration
- **Shipping Service (3006)** - DHL integration
- **Notification Service (3007)** - Email & SMS

## Environment Setup
All environment variables are in `.env`. Key configurations:
- `JWT_SECRET` - JWT token secret
- `MONGODB_URI` - Database connection
- `STRIPE_SECRET_KEY` - Payment processing
- `DHL_API_KEY` - Shipping integration
- Email and SMS credentials for notifications

See `.env.example` for complete configuration.
