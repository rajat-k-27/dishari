'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return spinner;
}
