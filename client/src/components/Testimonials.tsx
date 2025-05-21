import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "H1p4zdev delivered an exceptional web application that exceeded our expectations. The attention to detail and commitment to quality was impressive.",
    name: "Jane Doe",
    position: "Tech Startup, CEO",
    initials: "JD"
  },
  {
    quote: "Working with H1p4zdev was a pleasure. The mobile app developed for our company has helped streamline operations and improve customer engagement.",
    name: "Mark Smith",
    position: "Retail Company, CTO",
    initials: "MS"
  },
  {
    quote: "The cloud infrastructure implementation by H1p4zdev transformed our development process. We now deploy faster and more reliably than ever.",
    name: "Alex Lee",
    position: "SaaS Platform, DevOps Lead",
    initials: "AL"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 md:px-10 lg:px-0 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="font-sf text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Client <span className="text-primary">Testimonials</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="glass-card rounded-xl p-8 shadow-xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <div className="text-primary mb-4">
                <Quote className="h-8 w-8" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-4">
                  <span className="text-gray-600 dark:text-gray-400 text-xl font-bold">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
