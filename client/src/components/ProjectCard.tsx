import { motion } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import { getCategoryColor } from "@/lib/utils";

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

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const categoryClass = getCategoryColor(project.category);
  const categoryLabel = project.category.charAt(0).toUpperCase() + project.category.slice(1);
  
  // Special variant for the first card
  const isFirstCard = index === 0;
  
  // Special animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.1 * index,
        ease: "easeOut"
      }
    }
  };
  
  // Special hover animation for first card
  const firstCardHoverAnimation = {
    scale: 1.03,
    y: -15,
    rotateX: 5,
    rotateY: 2,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  };
  
  // Regular hover animation for other cards
  const regularHoverAnimation = {
    y: -10,
    rotateX: 5
  };
  
  return (
    <motion.div 
      className={`project-card glass-card rounded-xl overflow-hidden ${isFirstCard ? 'relative z-10' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
      whileHover={isFirstCard ? firstCardHoverAnimation : regularHoverAnimation}
    >
      {isFirstCard && (
        <motion.div 
          className="absolute -top-2 -right-2 z-20 bg-primary text-white rounded-full p-1"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        >
          <Star className="w-5 h-5 fill-current" />
        </motion.div>
      )}
      
      <motion.div 
        className="relative h-48 overflow-hidden"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover" 
        />
        
        <motion.div 
          initial={isFirstCard ? { x: -100, opacity: 0 } : { opacity: 1 }}
          animate={isFirstCard ? { x: 0, opacity: 1 } : { opacity: 1 }}
          transition={{ delay: isFirstCard ? 0.8 : 0, duration: 0.5 }}
          className={`absolute top-0 right-0 ${categoryClass} text-xs px-2 py-1 m-2 rounded-md`}
        >
          {categoryLabel}
        </motion.div>
        
        {isFirstCard && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}
      </motion.div>
      
      <div className="p-6">
        <motion.h3 
          className="font-sf text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200"
          initial={isFirstCard ? { y: 20, opacity: 0 } : { opacity: 1 }}
          animate={isFirstCard ? { y: 0, opacity: 1 } : { opacity: 1 }}
          transition={{ delay: isFirstCard ? 0.3 : 0 }}
        >
          {project.name}
          {isFirstCard && (
            <span className="text-primary ml-2">★</span>
          )}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
          initial={isFirstCard ? { y: 20, opacity: 0 } : { opacity: 1 }}
          animate={isFirstCard ? { y: 0, opacity: 1 } : { opacity: 1 }}
          transition={{ delay: isFirstCard ? 0.4 : 0 }}
        >
          {project.description}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-2 mb-6"
          initial={isFirstCard ? { y: 20, opacity: 0 } : { opacity: 1 }}
          animate={isFirstCard ? { y: 0, opacity: 1 } : { opacity: 1 }}
          transition={{ delay: isFirstCard ? 0.5 : 0 }}
        >
          {project.topics.slice(0, 3).map((topic, i) => (
            <motion.span 
              key={i} 
              className={`text-xs px-2 py-1 ${categoryClass} rounded-full ${isFirstCard ? 'font-medium' : ''}`}
              whileHover={{ scale: 1.1 }}
            >
              {topic}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex justify-between items-center"
          initial={isFirstCard ? { y: 20, opacity: 0 } : { opacity: 1 }}
          animate={isFirstCard ? { y: 0, opacity: 1 } : { opacity: 1 }}
          transition={{ delay: isFirstCard ? 0.6 : 0 }}
        >
          <motion.a 
            href={project.homepage || project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`text-primary font-medium ${isFirstCard ? 'neomorphic-button py-1 px-4 rounded-lg no-underline hover:text-primary/90' : 'hover:underline'}`}
            whileHover={isFirstCard ? { scale: 1.05 } : {}}
          >
            View Project
          </motion.a>
          
          <div className="flex space-x-2">
            <motion.a 
              href={project.html_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
              aria-label="View GitHub repository"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            
            {project.homepage && (
              <motion.a 
                href={project.homepage} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition"
                aria-label="Visit live site"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
