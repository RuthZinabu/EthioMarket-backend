# EmaCAre Platform Service Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT APPLICATIONS                        │
│              (Web, Mobile, Third-party Integrations)            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
        ┌────────────────▼────────────────┐
        │     API GATEWAY (Port 3000)     │
        │   Request Routing & Load        │
        │   Balancing                     │
        └────────┬──────────────┬──────────┘
                 │              │
         ┌───────▼─┐      ┌────▼──────┐
         │ Service │      │  Service  │
         │ Registry│      │  Mesh     │
         └─────────┘      └───────────┘
                 │              │
        ┌────────┴──────────────┴────────┐
        │                                 │
    ┌───▼──┐  ┌────┐  ┌────┐  ┌────┐   │
    │Auth  │  │Prod│  │Ord │  │Cart│   │
    │Srvc  │  │Srvc│  │Srvc│  │Srvc│   │
    └──────┘  └────┘  └────┘  └────┘   │
    ┌──────┐  ┌────┐  ┌────┐  ┌────┐   │
    │Payment  │Ship│  │Notif  │Shared   │
    │Service  │Srvc│  │Service│Utils    │
    └──────┘  └────┘  └────┘  └────┘   │
        │              │
        └──────┬───────┘
               │
    ┌──────────┴──────────────┐
    │                          │
 ┌──▼──┐              ┌────────▼──┐
 │ MongoDB           │    Redis    │
 │ (Persistent       │    (Cache)  │
 │  Data)            │             │
 └──────┘            └─────────────┘
```

## Service Communication

### Synchronous (HTTP/REST)
- **API Gateway** → Microservices routing
- **Order Service** → Product Service (stock check)
- **Order Service** → Cart Service (cart validation)
- **Payment Service** → Order Service (status update)
- **Shipping Service** → Order Service (tracking update)

### Asynchronous (Event-driven via webhooks)
- **Payment Service** → Notification Service (order confirmation)
- **Shipping Service** → Notification Service (tracking updates)
- **Order Service** → Shipping Service (shipment creation)

## Data Flow Examples

### Order Creation Flow
```
1. Client → API Gateway: POST /api/orders
2. API Gateway → Order Service: Create Order
3. Order Service → Product Service: Verify Stock
4. Order Service → Cart Service: Validate Cart Items
5. Order Service → Database: Store Order
6. Order Service → Payment Service: Request Payment
7. Payment Service → Stripe: Process Payment
8. Payment Service → Notification Service: Send Confirmation
9. Order Service → Shipping Service: Create Shipment
10. Shipping Service → DHL API: Register Shipment
11. Shipping Service → Notification Service: Send Tracking
```

### User Authentication Flow
```
1. Client → API Gateway: POST /api/auth/login
2. API Gateway → Auth Service: Verify Credentials
3. Auth Service → Database: Lookup User
4. Auth Service → bcryptjs: Verify Password
5. Auth Service → JWT: Generate Token
6. Auth Service → Client: Return Token
7. Client → API Gateway: Use Token in Headers
8. API Gateway → Auth Service: Verify Token
9. Auth Service → JWT: Validate Token
10. API Gateway → Requested Service: Forward Request
```

### Shopping Cart Flow
```
1. Client → API Gateway: GET /api/cart/user-123
2. API Gateway → Cart Service: Get Cart
3. Cart Service → Redis: Retrieve Cart Data
4. Redis → Cart Service: Return Cart
5. Cart Service → API Gateway: Return Items + Total
6. API Gateway → Client: Return Cart JSON

(On Checkout)
7. Client → API Gateway: POST /api/orders
8. Order Service → Cart Service: Get Full Cart
9. Cart Service → Product Service: Verify Stock
10. Product Service → Database: Check Inventory
11. Order Service → Payment Service: Process Payment
12. Payment Service → Cart Service: Clear Cart
13. Cart Service → Redis: Delete Cart Data
```

## Scalability Considerations

### Horizontal Scaling
- Each service can be scaled independently
- Use load balancers in front of API Gateway
- Implement rate limiting per service

### Vertical Scaling
- Increase resources (CPU, Memory) per container
- Optimize database queries with indexes
- Cache frequently accessed data in Redis

### Database Optimization
- MongoDB: Add appropriate indexes
- Separate databases for different services (if needed)
- Implement connection pooling

### Caching Strategy
- Redis for session/cart data
- API response caching in gateway
- Client-side caching with ETags

## Monitoring & Logging

### Health Checks
- Each service exposes `/health` endpoint
- API Gateway monitors all services
- Auto-restart failed services

### Logging
- Centralized logging system (ELK Stack)
- Request tracing with unique IDs
- Performance metrics tracking

## Security Features

- JWT authentication on all protected routes
- CORS configuration per service
- Request validation middleware
- Rate limiting on API Gateway
- DHL credentials encryption
- Stripe key management
- Email/SMS credential protection

## Deployment Strategies

### Development
- Local Yarn workspace development
- All services on single machine
- SQLite or local MongoDB

### Staging
- Docker Compose with separate containers
- Single instance per service
- Managed MongoDB/Redis

### Production
- Kubernetes orchestration
- Multiple replicas per service
- Managed databases (Atlas, ElastiCache)
- CDN for static assets
- Dedicated load balancers
- SSL/TLS certificates
