
"use client";

import { motion } from "framer-motion";

const AnimatedHeroText = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and slightly down
      animate={{ opacity: 1, y: 0 }}   // Fade in and slide up
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedHeroText;
