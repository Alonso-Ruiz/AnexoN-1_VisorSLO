import { defineConfig } from "vite";

const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://mt1.google.com https://*.google.com",
    "font-src 'self' data:",
    "connect-src 'self' https://mt1.google.com https://*.google.com"
  ].join("; "),
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()"
};

export default defineConfig({
  base: "./",
  build: {
    sourcemap: true
  },
  preview: {
    headers: securityHeaders
  },
  server: {
    host: "127.0.0.1"
  }
});
