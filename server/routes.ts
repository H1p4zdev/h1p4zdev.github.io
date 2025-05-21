import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub projects API route
  app.get("/api/github/projects", async (req, res) => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== "string") {
        return res.status(400).json({ message: "Username is required" });
      }
      
      // Check if we have cached projects for this username
      const cachedProjects = await storage.getProjectsByUsername(username);
      
      if (cachedProjects && cachedProjects.length > 0) {
        return res.json(cachedProjects);
      }
      
      // Fetch from GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      
      const repos = await response.json() as any[];
      
      // Map to our project structure
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
      
      // Cache the projects
      await Promise.all(projects.map(project => storage.createProject(project)));
      
      res.json(projects);
    } catch (error: any) {
      console.error("Error fetching GitHub projects:", error);
      res.status(500).json({ message: error.message || "Failed to fetch projects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to categorize repositories
function categorizeRepo(repo: any): string {
  const topics = repo.topics || [];
  const language = repo.language || "";
  
  if (topics.some(t => 
    ["react-native", "android", "ios", "flutter", "mobile"].includes(t.toLowerCase())
  )) {
    return "mobile";
  }
  
  if (topics.some(t => 
    ["web", "react", "vue", "angular", "nextjs", "gatsby", "frontend"].includes(t.toLowerCase())
  ) || ["JavaScript", "TypeScript", "HTML", "CSS"].includes(language)) {
    return "web";
  }
  
  if (topics.some(t => 
    ["ai", "machine-learning", "ml", "data-science", "tensorflow", "pytorch"].includes(t.toLowerCase())
  ) || ["Python", "R", "Julia"].includes(language)) {
    return "ai";
  }
  
  if (topics.some(t => 
    ["devops", "aws", "azure", "cloud", "kubernetes", "docker"].includes(t.toLowerCase())
  )) {
    return "devops";
  }
  
  return "other";
}

// Helper to get placeholder images
function getPlaceholderImage(index: number): string {
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
