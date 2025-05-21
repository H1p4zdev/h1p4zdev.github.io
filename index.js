// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  projects;
  projectsByUsername;
  currentUserId;
  currentProjectId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.projects = /* @__PURE__ */ new Map();
    this.projectsByUsername = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentProjectId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async getProjects() {
    return Array.from(this.projects.values());
  }
  async getProjectById(id) {
    return this.projects.get(id);
  }
  async getProjectsByUsername(username) {
    return this.projectsByUsername.get(username);
  }
  async createProject(project) {
    const id = this.currentProjectId++;
    const newProject = { ...project, id };
    this.projects.set(id, newProject);
    if (project.html_url && project.html_url.includes("github.com")) {
      const username = project.html_url.split("github.com/")[1]?.split("/")[0];
      if (username) {
        const existingProjects = this.projectsByUsername.get(username) || [];
        this.projectsByUsername.set(username, [...existingProjects, newProject]);
      }
    }
    return newProject;
  }
};
var storage = new MemStorage();

// server/routes.ts
import fetch from "node-fetch";
async function registerRoutes(app2) {
  app2.get("/api/github/projects", async (req, res) => {
    try {
      const { username } = req.query;
      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Username is required" });
      }
      const cachedProjects = await storage.getProjectsByUsername(username);
      if (cachedProjects && cachedProjects.length > 0) {
        return res.json(cachedProjects);
      }
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      const repos = await response.json();
      const projects = repos.map((repo, index) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "No description available",
        html_url: repo.html_url,
        homepage: repo.homepage || "",
        topics: repo.topics || [],
        // Categorize based on topics or language
        category: categorizeRepo(repo),
        language: repo.language,
        // Use placeholder images
        image: getPlaceholderImage(index),
        created_at: repo.created_at,
        updated_at: repo.updated_at
      }));
      await Promise.all(projects.map((project) => storage.createProject(project)));
      res.json(projects);
    } catch (error) {
      console.error("Error fetching GitHub projects:", error);
      res.status(500).json({ message: error.message || "Failed to fetch projects" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
function categorizeRepo(repo) {
  const topics = repo.topics || [];
  const language = repo.language || "";
  if (topics.some(
    (t) => ["react-native", "android", "ios", "flutter", "mobile"].includes(t.toLowerCase())
  )) {
    return "mobile";
  }
  if (topics.some(
    (t) => ["web", "react", "vue", "angular", "nextjs", "gatsby", "frontend"].includes(t.toLowerCase())
  ) || ["JavaScript", "TypeScript", "HTML", "CSS"].includes(language)) {
    return "web";
  }
  if (topics.some(
    (t) => ["ai", "machine-learning", "ml", "data-science", "tensorflow", "pytorch"].includes(t.toLowerCase())
  ) || ["Python", "R", "Julia"].includes(language)) {
    return "ai";
  }
  if (topics.some(
    (t) => ["devops", "aws", "azure", "cloud", "kubernetes", "docker"].includes(t.toLowerCase())
  )) {
    return "devops";
  }
  return "other";
}
function getPlaceholderImage(index) {
  const images = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1552068751-34cb5cf055b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  ];
  return images[index % images.length];
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/your-repo-name/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
