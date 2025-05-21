import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset the text when text prop changes
    setDisplayedText("");
    setIsTyping(false);
    
    let timeout: NodeJS.Timeout;
    let currentIndex = 0;
    
    // Delay the start of typing
    timeout = setTimeout(() => {
      setIsTyping(true);
      
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 100);
      
      return () => clearInterval(typingInterval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <motion.h2 
      className={`${className} relative`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {displayedText}
      {isTyping && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-primary ml-1 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </motion.h2>
  );
}
