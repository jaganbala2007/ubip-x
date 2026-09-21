import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  viewKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, viewKey }) => {
  return (
    <motion.div
      key={viewKey}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }}
    >
      {children}
    </motion.div>
  );
};
