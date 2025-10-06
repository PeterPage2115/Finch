'use client';
import { motion } from 'framer-motion';

/**
 * Template wrapper for all pages in the app.
 * 
 * Next.js 15 template.tsx creates a NEW instance on every navigation,
 * making it perfect for page transition animations with framer-motion.
 * 
 * Animation:
 * - fadeIn from slightly below (y: 20)
 * - duration: 0.5s with easeOut
 * - GPU-accelerated (opacity + transform only)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
