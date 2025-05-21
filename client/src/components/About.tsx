import { motion } from "framer-motion";
import { GraduationCap, IdCard, Code, Smartphone, Server } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 md:px-10 lg:px-0 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-100/30 dark:bg-blue-900/20 blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-purple-100/30 dark:bg-purple-900/20 blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2 
          className="font-sf text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About <span className="text-primary">Me</span>
        </motion.h2>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <motion.div 
            className="md:w-2/5 relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="rounded-2xl overflow-hidden relative border-4 border-primary p-1"
              whileHover={{ scale: 1.02 }}
              style={{
                boxShadow: "0px 10px 30px rgba(0, 112, 243, 0.2)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80"
                alt="Developer workspace with laptop and code displayed"
                className="w-full h-auto object-cover rounded-xl"
              />
              
              {/* Overlay gradient for the image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-xl"></div>
            </motion.div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-blue-500/20 dark:bg-blue-500/10"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.6, 0.8, 0.6]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
            />
            
            <motion.div 
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-purple-500/20 dark:bg-purple-500/10"
              animate={{ 
                y: [0, 10, 0],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut" 
              }}
            />
          </motion.div>
          
          <motion.div 
            className="md:w-3/5"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6 md:p-8 rounded-2xl neomorphic-card">
              <h3 className="font-sf text-2xl font-semibold mb-6 text-primary">Who I Am</h3>
              <p className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                I'm a passionate developer with expertise in building modern, responsive web applications and mobile solutions. With a background in both frontend and backend technologies, I bring a holistic approach to every project.
              </p>
              <p className="text-lg leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                My journey into development began with a curiosity about how things work and a desire to build solutions that make a difference. Today, I create applications that combine aesthetic appeal with powerful functionality.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div 
                  className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-sf font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Education</h4>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <GraduationCap className="text-primary h-4 w-4" />
                      </div>
                      <span>Computer Science, BSc</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <IdCard className="text-primary h-4 w-4" />
                      </div>
                      <span>Full Stack Development</span>
                    </motion.li>
                  </ul>
                </motion.div>
                
                <motion.div 
                  className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20"
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-sf font-semibold text-lg mb-4 text-gray-800 dark:text-gray-200">Interests</h4>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                        <Code className="text-purple-600 dark:text-purple-400 h-4 w-4" />
                      </div>
                      <span>Open Source</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                        <Smartphone className="text-purple-600 dark:text-purple-400 h-4 w-4" />
                      </div>
                      <span>Mobile Development</span>
                    </motion.li>
                    <motion.li 
                      className="flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                        <Server className="text-purple-600 dark:text-purple-400 h-4 w-4" />
                      </div>
                      <span>Cloud Architecture</span>
                    </motion.li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
