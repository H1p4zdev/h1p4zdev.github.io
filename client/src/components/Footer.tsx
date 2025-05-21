import { motion } from "framer-motion";
import { Link } from "wouter";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 px-4 md:px-10 lg:px-0 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-sf text-2xl font-bold text-primary">H1p4zdev</div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">About</a>
            <a href="#projects" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Projects</a>
            <a href="#skills" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Skills</a>
            <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">Contact</a>
          </motion.div>
          
          <motion.div 
            className="flex space-x-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a 
              href="https://github.com/h1p4zdev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition social-icon"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition social-icon"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition social-icon"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
        
        <motion.div 
          className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>&copy; {new Date().getFullYear()} H1p4zdev. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
