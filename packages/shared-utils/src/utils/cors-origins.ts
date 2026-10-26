import cors from "cors";
export const allowedOrigins = new Set([
  //agent
  "https://agency-portal.ethio-postethiopia.com",

  //localhost
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
]);

export const allowedHeaders = [
  "Content-Type", // application/json triggers preflight
  "Authorization", // Bearer tokens etc.
  "X-Requested-With", // often added by axios or legacy code
  "X-CSRF-Token", // csrf token next js
  "X-XSRF-TOKEN", // axios' default cookie-to-header name
  "Sourceapp", //to idnetify from request come from app or dashaboard for merchant case
  "X-Message_Id",
  "x-message-id",
  "x_superapp_id",
  "X_Superapp_Id",
  "X-Api-Key",
  "X-K",
];

export const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow all origins
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders,
  exposedHeaders: ["Content-Length", "X-New-Token", "x-k"],
  maxAge: 86400, // cache preflight for 1 day
};
