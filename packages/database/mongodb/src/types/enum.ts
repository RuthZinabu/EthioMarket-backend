export enum ProductCategory {
  ELECTRONICS = "electronics",
  FASHION = "fashion",
  BEAUTY = "beauty",
  SPORTS = "sports",
  BOOKS = "books",
  FOOD = "food",
  SPICY = "spicy",
  HONEY = "honey",
  CLOTH = "cloth",
  OTHER = "other"
}

export enum Realm {
  Institution = "Institution",
  Agent = "Agent",
  Vendor = "Vendor",
  Customer = "Customer",
  Default = "default",
}

export enum Status {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISABLED = "DISABLED",
}

export enum CalculationType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
  FIXED = "FIXED",
}

export enum RequestActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
}

export enum KYCPurpose {
  WALLET_OPENING = "wallet_opening",
  LEVEL_UPGRADE = "level_upgrade",
}

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export enum Currency {
  ETB = "ETB",
  USD = "USD",
}

export enum PayoutStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum VendorStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export enum PayoutMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  STRIPE_EXPRESS = "STRIPE_EXPRESS",
  PAYPAL = "PAYPAL",
}

export enum UserRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  VendorOwner = "VendorOwner",
  VendorStaff = "VendorStaff",
  Maker = "Maker",
  Checker = "Checker",
  FullAuthorizer = "FullAuthorizer",
  Customer = "Customer",
}
export enum VendorType {
  IN_HOUSE = "IN_HOUSE",
  EXTERNAL = "EXTERNAL", 
}

