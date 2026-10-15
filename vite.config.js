import { defineConfig, transformWithEsbuild } from "vite";
import { cpSync, existsSync, rmSync, readFileSync } from "node:fs";
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
            const staticDirs = ["assets/js", "data", "vendor/resources"];

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

function bundleLegacyStartup() {
    const moduleId = "virtual:visor-legacy";
    let productionBuild = false;
    let bundleReference;

    return {
        name: "bundle-legacy-startup",
        configResolved(config) {
            productionBuild = config.command === "build";
        },
        async buildStart() {
            if (!productionBuild) return;
            const paths = JSON.parse(readFileSync(resolve(cwd(), "src/legacy-scripts.json"), "utf8"));
            const source = paths.map((path) => readFileSync(resolve(cwd(), path), "utf8")).join("\n;\n");
            // Keep global names: the exported QGIS scripts share them at runtime.
            const result = await transformWithEsbuild(source, "visor-legacy.js", {
                minify: true,
                minifyIdentifiers: false,
                legalComments: "inline",
                target: "es2022"
            });
            bundleReference = this.emitFile({ type: "asset", name: "visor-legacy.js", source: result.code });
        },
        resolveId(id) {
            if (id === moduleId) return "\0" + moduleId;
        },
        load(id) {
            if (id !== "\0" + moduleId) return;
            return productionBuild
                ? `export default import.meta.ROLLUP_FILE_URL_${bundleReference};`
                : "export default null;";
        }
    };
}

export default defineConfig({
    base: "./",
    plugins: [bundleLegacyStartup(), copyLegacyStaticAssets()],
    build: {
        sourcemap: false
    },
    preview: {
        headers: securityHeaders
    },
    server: {
        host: "127.0.0.1"
    }
});
