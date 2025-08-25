import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import animationData from './animation.json';

export default function AnimatedButton({ children, ...props }) {
  return (
    <motion.button
      className="btn-primary"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      <Lottie animationData={animationData} style={{ width: 40, height: 40 }} />
      {children}
    </motion.button>
  );
}
