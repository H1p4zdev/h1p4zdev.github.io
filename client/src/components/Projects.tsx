import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchGitHubProjects } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  category: string;
  language: string;
  image: string;
}

// Fallback projects in case the API fails
const fallbackProjects: Project[] = [
  {
    id: 1,
    name: "Analytics Dashboard",
    description: "A comprehensive analytics dashboard with interactive charts and real-time data visualization.",
    html_url: "https://github.com/h1p4zdev/analytics-dashboard",
    homepage: "https://analytics-dashboard.h1p4zdev.com",
    topics: ["react", "d3js", "firebase"],
    category: "web",
    language: "JavaScript",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 2,
    name: "Fitness Tracker",
    description: "A mobile application for tracking workouts, nutrition, and health metrics with personalized insights.",
    html_url: "https://github.com/h1p4zdev/fitness-tracker",
    homepage: "https://play.google.com/store/apps/details?id=com.h1p4zdev.fitnesstracker",
    topics: ["react-native", "redux", "healthkit"],
    category: "mobile",
    language: "TypeScript",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 3,
    name: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with product management, cart functionality, and payment processing.",
    html_url: "https://github.com/h1p4zdev/ecommerce-platform",
    homepage: "https://shop.h1p4zdev.com",
    topics: ["nextjs", "stripe", "mongodb"],
    category: "web",
    language: "TypeScript",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 4,
    name: "AI Code Assistant",
    description: "An intelligent code assistant that helps developers write better code through ML-powered suggestions.",
    html_url: "https://github.com/h1p4zdev/ai-code-assistant",
    homepage: "https://ai-assistant.h1p4zdev.com",
    topics: ["python", "tensorflow", "nlp"],
    category: "ai",
    language: "Python",
    image: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 5,
    name: "Social Networking App",
    description: "A feature-rich social networking application with real-time chat, media sharing, and event coordination.",
    html_url: "https://github.com/h1p4zdev/social-network",
    homepage: "https://social.h1p4zdev.com",
    topics: ["react-native", "graphql", "firebase"],
    category: "mobile",
    language: "JavaScript",
    image: "https://images.unsplash.com/photo-1552068751-34cb5cf055b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: 6,
    name: "Cloud DevOps Platform",
    description: "A unified platform for managing cloud infrastructure, CI/CD pipelines, and application deployments.",
    html_url: "https://github.com/h1p4zdev/devops-platform",
    homepage: "https://devops.h1p4zdev.com",
    topics: ["nodejs", "docker", "kubernetes"],
    category: "devops",
    language: "JavaScript",
    image: "https://images.unsplash.com/photo-1550063873-ab792950096b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400"
  }
];

export default function Projects() {
  const [filter, setFilter] = useState("all");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["/api/github/projects"],
    queryFn: () => fetchGitHubProjects("h1p4zdev"),
    retry: 1
  });

  useEffect(() => {
    const data = projects || fallbackProjects;
    
    if (filter === "all") {
      setFilteredProjects(data);
    } else {
      setFilteredProjects(data.filter(project => project.category === filter));
    }
  }, [filter, projects]);

  return (
    <section id="projects" className="py-20 px-4 md:px-10 lg:px-0 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="font-sf text-4xl md:text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="text-primary">Projects</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-center max-w-3xl mx-auto mb-16 text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A collection of my recent work and contributions. Each project represents a unique challenge and solution.
        </motion.p>
        
        <motion.div 
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full max-w-md">
            <TabsList className="grid grid-cols-4 h-12">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button asChild className="inline-flex items-center gap-2 px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
            <a href="https://github.com/h1p4zdev" target="_blank" rel="noopener">
              <Github className="h-5 w-5 mr-2" />
              More Projects on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
