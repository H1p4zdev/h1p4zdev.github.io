import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    // Add floating animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      .floating {
        animation: float 6s ease-in-out infinite;
      }
      
      .floating-reverse {
        animation: float-reverse 7s ease-in-out infinite;
      }
      
      .floating-slow {
        animation: float 8s ease-in-out infinite;
      }
      
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      @keyframes float-reverse {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(20px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    `;
    document.head.appendChild(style);
    
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash && target.hash.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.hash);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    // Add title and meta tags
    document.title = "H1p4zdev | App & Web Developer";
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'H1p4zdev is a skilled developer specializing in modern web applications and mobile solutions.';
    document.head.appendChild(metaDescription);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Testimonials />
        <Contact />
        <Footer />
      </motion.div>
    </>
  );
}
