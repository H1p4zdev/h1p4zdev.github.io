# Portfolio Website Project

## Overview

This project is a full-stack web application designed as a developer portfolio website. It consists of a React frontend with Tailwind CSS and Shadcn UI components, an Express.js backend, and uses Drizzle ORM for database operations. The application follows a modern architecture with clearly separated client and server code, shared data models, and a responsive UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with the following components:

1. **Frontend**: React application with Tailwind CSS for styling and a comprehensive UI component library based on Shadcn UI. The frontend is built using Vite and TypeScript.

2. **Backend**: Express.js server handling API requests and serving the static frontend files in production.

3. **Database**: The application uses Drizzle ORM and is configured to work with PostgreSQL, though the database connection needs to be set up.

4. **State Management**: React Query is used for server state management, providing a clean interface for data fetching, caching, and synchronization.

5. **Routing**: The application uses Wouter for lightweight client-side routing.

## Key Components

### Frontend Components

1. **Pages**:
   - Home: The main landing page containing various sections
   - NotFound: A 404 page for handling non-existent routes

2. **UI Sections**:
   - Navbar: Navigation component with mobile-responsive design
   - Hero: Main hero section of the landing page
   - About: Information about the developer
   - Projects: Portfolio projects section with GitHub integration
   - Skills: Developer skills showcase
   - Testimonials: Client testimonials section
   - Contact: Contact form section
   - Footer: Page footer with links

3. **UI Components**:
   - Comprehensive UI component library based on Shadcn UI/Radix UI
   - Custom components like AnimatedText, ParallaxWrapper, ProjectCard, etc.

### Backend Components

1. **API Routes**:
   - `/api/github/projects`: Fetches and caches GitHub projects

2. **Storage**:
   - In-memory storage implementation for users and projects
   - Prepared for potential database integration

3. **Server Configuration**:
   - Vite middleware for development
   - Static file serving for production
   - Request logging and error handling

### Shared Components

1. **Database Schema**:
   - Users: For user authentication
   - Projects: For storing project information

## Data Flow

1. **User Interaction Flow**:
   - User visits the website
   - Frontend components are loaded and displayed
   - Data is fetched from the backend API as needed
   - User can navigate between different sections using the navbar

2. **GitHub Projects Flow**:
   - The projects section requests data from `/api/github/projects`
   - The backend checks if cached data exists for the requested username
   - If cached, it returns the data; otherwise, it fetches from GitHub API
   - The data is processed, cached for future requests, and returned to the frontend
   - Frontend displays the projects in cards with filtering options

## External Dependencies

1. **UI/Frontend**:
   - React and React DOM
   - Tailwind CSS for styling
   - Radix UI components (accordion, dialog, etc.)
   - Framer Motion for animations
   - React Query for data fetching and state management
   - Wouter for client-side routing

2. **Backend**:
   - Express.js for the server
   - Node-fetch for making HTTP requests
   - Drizzle ORM for database operations

3. **Development**:
   - Vite for development and building
   - TypeScript for type safety
   - ESBuild for production bundling

## Deployment Strategy

The application is configured for deployment on Replit with the following strategy:

1. **Development**:
   - Run `npm run dev` to start the development server
   - Vite middleware serves the frontend with hot module replacement
   - Backend API is available on the same port (5000)

2. **Production**:
   - Build step: `npm run build` compiles the frontend and backend
   - Start command: `npm run start` runs the bundled application
   - Express serves the static frontend files and handles API requests
   - Port 5000 is mapped to port 80 for external access

3. **Database**:
   - PostgreSQL module is included in .replit but needs to be configured
   - DATABASE_URL environment variable needs to be set up

## Getting Started

To work with this codebase:

1. Make sure the database is properly provisioned and the DATABASE_URL is set.
2. Run `npm run dev` to start the development server.
3. The application will be available at port 5000.
4. To make database schema changes, modify `shared/schema.ts` and run `npm run db:push`.

## Next Steps for Development

1. Set up proper database connection with PostgreSQL
2. Implement authentication system using the provided user schema
3. Complete the server routes for GitHub project fetching
4. Enhance the project with additional features like blog posts or a contact form backend