import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, MapPin, GitBranch, 
  Github, Linkedin, Twitter, Instagram, Dribbble
} from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 md:px-10 lg:px-0 animated-bg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="font-sf text-4xl md:text-5xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In <span className="text-primary">Touch</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-center max-w-3xl mx-auto mb-16 text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Have a project in mind or just want to say hello? Feel free to reach out!
        </motion.p>
        
        <div className="flex flex-col md:flex-row gap-12">
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form className="glass-card rounded-xl p-8 shadow-xl">
              <div className="mb-6">
                <Label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Name</Label>
                <Input 
                  type="text" 
                  id="name" 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Your name" 
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Your email" 
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2">Subject</Label>
                <Input 
                  type="text" 
                  id="subject" 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Subject" 
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Message</Label>
                <Textarea 
                  id="message" 
                  rows={5} 
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Your message"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium"
              >
                Send Message
              </Button>
            </form>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass-card rounded-xl p-8 shadow-xl h-full">
              <h3 className="font-sf text-2xl font-semibold mb-8 text-primary">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <a 
                      href="mailto:contact@h1p4zdev.com" 
                      className="text-gray-800 dark:text-gray-200 font-medium hover:text-primary dark:hover:text-primary transition"
                    >
                      contact@h1p4zdev.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">San Francisco, California</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 text-primary">
                    <GitBranch className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Work Availability</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">Open to freelance & full-time opportunities</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h4 className="font-sf text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Connect With Me</h4>
                <div className="flex space-x-5">
                  <motion.a 
                    href="https://github.com/h1p4zdev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition social-icon"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Github className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition social-icon"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Linkedin className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition social-icon"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Twitter className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition social-icon"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Instagram className="h-5 w-5" />
                  </motion.a>
                  <motion.a 
                    href="https://dribbble.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition social-icon"
                    whileHover={{ scale: 1.2 }}
                  >
                    <Dribbble className="h-5 w-5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
