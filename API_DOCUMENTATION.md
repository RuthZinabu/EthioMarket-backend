# EmaCAre Platform - API Documentation

## Base URLs

| Environment | URL |
|---|---|
| Development | http://localhost:3000 |
| Staging | https://staging-api.emacare.com |
| Production | https://api.emacare.com |

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Services Overview

### 1. Auth Service
Base URL: `/api/auth`

#### Register User
```
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "statusCode": 201
}
```

#### Login
```
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "statusCode": 200
}
```

#### Verify Token
```
POST /verify
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "data": {
    "userId": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "iat": 1234567890,
    "exp": 1234654290
  },
  "statusCode": 200
}
```

### 2. Product Service
Base URL: `/api/products`

#### Get All Products
```
GET /
Query Parameters:
  - category: "food" | "spicy" | "honey" | "cloth"
  - search: string

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Berbere Spice Mix",
      "category": "spicy",
      "description": "Traditional Ethiopian hot spice blend",
      "price": 15.99,
      "stock": 100,
      "image": "berbere.jpg",
      "origin": "Ethiopia"
    },
    ...
  ],
  "statusCode": 200
}
```

#### Get Product by ID
```
GET /:id

Response: 200 OK
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Berbere Spice Mix",
    ...
  },
  "statusCode": 200
}
```

#### Create Product (Admin)
```
POST /
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "New Product",
  "category": "food",
  "description": "Product description",
  "price": 25.99,
  "stock": 50,
  "image": "product.jpg",
  "origin": "Ethiopia"
}

Response: 201 Created
```

#### Update Inventory
```
PATCH /:id/inventory
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "stock": 75
}

Response: 200 OK
```

### 3. Cart Service
Base URL: `/api/cart`

#### Get Cart
```
GET /:userId

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": "1",
        "quantity": 2,
        "price": 15.99
      }
    ],
    "total": 31.98
  },
  "statusCode": 200
}
```

#### Add to Cart
```
POST /:userId/items
Content-Type: application/json

{
  "productId": "1",
  "quantity": 2,
  "price": 15.99
}

Response: 200 OK
{
  "success": true,
  "data": {
    "items": [...],
    "total": 31.98
  },
  "statusCode": 200
}
```

#### Remove from Cart
```
DELETE /:userId/items/:productId

Response: 200 OK
```

#### Clear Cart
```
DELETE /:userId

Response: 200 OK
{
  "success": true,
  "data": {
    "message": "Cart cleared"
  }
}
```

### 4. Order Service
Base URL: `/api/orders`

#### Create Order
```
POST /
Content-Type: application/json

{
  "userId": "user-123",
  "items": [
    {"productId": "1", "quantity": 2, "price": 15.99}
  ],
  "totalAmount": 31.98,
  "shippingAddress": "123 Main St, Addis Ababa, Ethiopia"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "order-123",
    "userId": "user-123",
    "items": [...],
    "totalAmount": 31.98,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "statusCode": 201
}
```

#### Get Order
```
GET /:orderId
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
```

#### Get User Orders
```
GET /user/:userId
Authorization: Bearer <JWT_TOKEN>

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "id": "order-123",
      "status": "pending",
      ...
    },
    ...
  ]
}
```

#### Update Order Status
```
PATCH /:orderId/status
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "confirmed"
}

Response: 200 OK
```

### 5. Payment Service
Base URL: `/api/payments`

#### Process Payment
```
POST /process
Content-Type: application/json

{
  "orderId": "order-123",
  "amount": 31.98,
  "currency": "USD",
  "paymentMethod": "stripe"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "payment-123",
    "orderId": "order-123",
    "amount": 31.98,
    "status": "completed",
    "transactionId": "txn_...",
    "message": "Payment processed successfully"
  },
  "statusCode": 201
}
```

#### Get Payment
```
GET /:paymentId

Response: 200 OK
```

#### Get Order Payments
```
GET /order/:orderId

Response: 200 OK
```

### 6. Shipping Service
Base URL: `/api/shipping`

#### Create Shipment
```
POST /
Content-Type: application/json

{
  "orderId": "order-123",
  "recipientName": "John Doe",
  "recipientAddress": "123 Main St",
  "recipientCity": "New York",
  "recipientCountry": "USA",
  "weight": 2.5,
  "items": [
    {"description": "Berbere Spice", "quantity": 1, "value": 15.99}
  ]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "shipment-123",
    "trackingNumber": "1234567890",
    "carrier": "DHL",
    "status": "picked_up",
    "estimatedDelivery": "2024-01-22T00:00:00Z"
  },
  "statusCode": 201
}
```

#### Track Shipment
```
GET /track/:trackingNumber

Response: 200 OK
{
  "success": true,
  "data": {
    "trackingNumber": "1234567890",
    "carrier": "DHL",
    "status": "in_transit",
    "estimatedDelivery": "2024-01-22T00:00:00Z",
    "updates": [
      {
        "status": "picked_up",
        "timestamp": "2024-01-15T10:30:00Z",
        "location": "Addis Ababa"
      }
    ]
  }
}
```

#### Get Order Shipment
```
GET /order/:orderId

Response: 200 OK
```

### 7. Notification Service
Base URL: `/api/notifications`

#### Send Email
```
POST /email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Order Confirmation",
  "body": "<h1>Thank you for your order</h1>",
  "type": "order_confirmation"
}

Response: 201 Created
```

#### Send SMS
```
POST /sms
Content-Type: application/json

{
  "phoneNumber": "+251911234567",
  "message": "Your order #123 has been confirmed"
}

Response: 201 Created
```

#### Send Order Confirmation
```
POST /order-confirmation
Content-Type: application/json

{
  "orderId": "order-123",
  "email": "user@example.com",
  "customerName": "John Doe",
  "items": [...],
  "totalAmount": 31.98
}

Response: 200 OK
```

#### Send Shipment Update
```
POST /shipment-update
Content-Type: application/json

{
  "trackingNumber": "123456",
  "email": "user@example.com",
  "status": "in_transit",
  "estimatedDelivery": "2024-01-22"
}

Response: 200 OK
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Error message"
}
```

### Common Status Codes
- `200 OK` - Successful request
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Rate Limiting

Rate limits are applied per IP address:
- 100 requests per minute for public endpoints
- 500 requests per minute for authenticated endpoints

## CORS

CORS is enabled for all services. Allowed origins:
- Development: `*`
- Production: Specific configured domains
