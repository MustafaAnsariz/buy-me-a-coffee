
"use client";

import { motion } from "framer-motion";

const AnimatedSection = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start invisible and further down
      whileInView={{ opacity: 1, y: 0 }} // Animate when the component scrolls into view
      viewport={{ once: true, amount: 0.3 }} // Trigger animation once, when 30% is visible
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }} // Add a slight delay
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
