import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AnimatedText from "./AnimatedText";

export default function Hero() {
  return (
    <section id="home" className="min-h-[85vh] flex items-center justify-center pt-16 pb-6 px-2 relative overflow-hidden">
      {/* Blob background - scaled down for mobile */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[150px] h-[150px] md:w-[350px] md:h-[350px] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-[100px] h-[100px] md:w-[300px] md:h-[300px] rounded-full bg-cyan-200/20 dark:bg-cyan-900/20 blur-3xl"></div>
      </div>

      {/* Bordered card effect matching the screenshot - with width constraints for mobile */}
      <motion.div 
        className="relative z-10 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-md mx-auto border-3 border-blue-500 rounded-3xl p-3 sm:p-5 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          boxShadow: "0px 0px 20px rgba(0, 112, 243, 0.2)",
          borderRadius: "24px"
        }}
      >
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            background: "radial-gradient(circle, rgba(229,244,255,0.8) 0%, rgba(243,238,255,0.6) 100%)",
            opacity: 0.8
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        <div className="text-center z-10 relative">
          <motion.h1 
            className="font-sf text-3xl xs:text-4xl sm:text-5xl font-bold mb-1 sm:mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-primary">H1p4zdev</span>
          </motion.h1>

          <AnimatedText 
            text="Turning Ideas Into Digital Reality"
            className="font-sf text-base xs:text-lg sm:text-xl font-medium mb-2 sm:mb-4"
            delay={0.8}
          />

          <motion.p 
            className="text-xs xs:text-sm sm:text-base max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6 text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            Crafting elegant digital experiences with code. Specialized in building modern web applications and mobile solutions.
          </motion.p>

          <motion.div 
            className="flex flex-col xs:flex-row items-center justify-center space-y-2 xs:space-y-0 xs:space-x-3 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            <motion.a 
              href="#projects"
              className="w-full xs:w-auto px-5 py-2 text-sm sm:text-base bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
              whileHover={{ y: -3, boxShadow: "0px 8px 15px rgba(0, 112, 243, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              View My Work
            </motion.a>
            
            <motion.a 
              href="#contact"
              className="w-full xs:w-auto px-5 py-2 text-sm sm:text-base border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
              whileHover={{ y: -3, boxShadow: "0px 8px 15px rgba(0, 112, 243, 0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-2 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <motion.a 
          href="#about" 
          className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-gray-800 text-primary shadow-md"
          whileHover={{ y: -2, boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -4, 0] }}
          transition={{ 
            y: { 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }
          }}
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
