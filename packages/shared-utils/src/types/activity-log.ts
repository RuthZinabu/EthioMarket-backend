export interface IUserActivityLog {
  customerId?: string;
  userPhone?: string;
  userRole?: string;
  action: string;
  description?: string;
  module: string;
  ip?: string;
  userAgent?: string;
  method: string;
  path: string;
  statusCode: number;
  success: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityOptions {
  action?: string;
  description?: string;
  module?: string;
}
