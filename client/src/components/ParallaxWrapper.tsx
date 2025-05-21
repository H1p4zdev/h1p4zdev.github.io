import { useRef, useEffect, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function ParallaxWrapper({ children, className }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const layers = ref.current.querySelectorAll('.parallax-layer');
      
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;
      
      layers.forEach((layer) => {
        const depth = parseFloat((layer as HTMLElement).dataset.depth || "0.2");
        const moveX = mouseX * depth * 50;
        const moveY = mouseY * depth * 50;
        
        (layer as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <motion.section 
      ref={ref}
      style={{ y }}
      className={`${className || ""} relative overflow-hidden`}
    >
      {children}
    </motion.section>
  );
}
