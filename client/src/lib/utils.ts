import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function fetchGitHubProjects(username: string) {
  try {
    const response = await fetch(`/api/github/projects?username=${username}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    throw error;
  }
}

export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'web':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
    case 'mobile':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
    case 'ai':
      return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100';
    case 'devops':
      return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
  }
}
