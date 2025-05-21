import { motion } from "framer-motion";
import { 
  FaReact, FaNodeJs, FaJs, FaPython, 
  FaAws, FaHtml5, FaCss3, FaDocker, FaMobileAlt
} from "react-icons/fa";

const skills = [
  { name: "Frontend Development", percentage: 95 },
  { name: "Mobile App Development", percentage: 85 },
  { name: "Backend Development", percentage: 80 },
  { name: "Cloud & DevOps", percentage: 75 },
  { name: "UI/UX Design", percentage: 70 }
];

const technologies = [
  { name: "React", icon: FaReact },
  { name: "Node.js", icon: FaNodeJs },
  { name: "JavaScript", icon: FaJs },
  { name: "React Native", icon: FaReact },
  { name: "Python", icon: FaPython },
  { name: "AWS", icon: FaAws },
  { name: "HTML5", icon: FaHtml5 },
  { name: "CSS3", icon: FaCss3 },
  { name: "Docker", icon: FaDocker }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 px-4 md:px-10 lg:px-0">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="font-sf text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My <span className="text-primary">Skills</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="font-sf text-2xl font-semibold mb-6 text-primary">Technical Expertise</h3>
            
            <div className="space-y-8">
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 1, width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + (index * 0.1) }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-primary font-medium">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${skill.percentage}%` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-3 gap-4">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-xl p-4 text-center"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <tech.icon className="mx-auto text-4xl text-primary mb-2" />
                  <p className="font-medium text-gray-800 dark:text-gray-200">{tech.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
