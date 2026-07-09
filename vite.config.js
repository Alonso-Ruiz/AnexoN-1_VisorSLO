import { defineConfig } from "vite";
import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";

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

function copyLegacyStaticAssets() {
  return {
    name: "copy-legacy-static-assets",
    closeBundle() {
      const staticDirs = ["data", "vendor/resources"];

      staticDirs.forEach((dir) => {
        const source = resolve(cwd(), dir);
        const target = resolve(cwd(), "dist", dir);

        if (!existsSync(source)) {
          return;
        }

        rmSync(target, { recursive: true, force: true });
        cpSync(source, target, { recursive: true });
      });
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [copyLegacyStaticAssets()],
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
