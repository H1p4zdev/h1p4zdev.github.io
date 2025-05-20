import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config"; // Assuming vite.ts is in 'server/' and vite.config.ts is at root
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    // allowedHosts: true, // This is usually not needed for middlewareMode unless specific proxying issues
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false, // Correct, as you're passing config programmatically
    customLogger: {
      ...viteLogger,
      error: (msg, options) => { // <<<<<<<<<<<< CHANGED: Removed process.exit(1)
        viteLogger.error(msg, options);
        // process.exit(1); // Removed: Let Vite handle error display without crashing server
      },
    },
    server: serverOptions,
    appType: "custom", // Correct for integrating with an existing server
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Path assumes 'vite.ts' is in 'server/' and 'client/' is a sibling to 'server/'
      const clientTemplatePath = path.resolve(
        import.meta.dirname, // Directory of the current module (e.g., server/vite.js after compilation)
        "..",                // Up to project root
        "client",            // Into client directory
        "index.html",
      );

      // Always reload the index.html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplatePath, "utf-8");

      // Consider if this nanoid cache busting is truly necessary; Vite HMR is usually sufficient
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Path assumes 'vite.ts' is in 'server/' and 'dist/public' is at the project root
  const distPath = path.resolve(
    import.meta.dirname, // Directory of the current module (e.g., server/vite.js after compilation)
    "..",                // Up to project root
    "dist",              // Into dist directory (root of build output)
    "public"             // Into public subdirectory within dist
  );

  if (!fs.existsSync(distPath)) {
    // Provide a more specific error message if the directory structure is known
    log(`Build output directory not found at: ${distPath}`, "vite-prod");
    log("Make sure to build the client first (e.g., 'npm run build' in client directory or root).", "vite-prod");
    // Depending on desired behavior, you might throw, or just log and let Express handle it (likely 404)
    // For now, let's throw as per original code, but logging is also good.
    throw new Error(
      `Build output directory not found: ${distPath}. Ensure the client is built and vite.config.ts build.outDir is configured correctly relative to this path. Expected structure: your-project-root/dist/public/`,
    );
  }

  log(`Serving static files from: ${distPath}`, "vite-prod");
  app.use(express.static(distPath));

  // Fall through to index.html if the file doesn't exist (for client-side routing)
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        log(`index.html not found in ${distPath}. SPA fallback will fail.`, "vite-prod-error");
        res.status(404).send("Application not found. Missing index.html in build output.");
    }
  });
}
