'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const icons = {
  success: FaCheck,
  error: FaTimes,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
};

const colors = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export default function Alert({ type = 'info', message, onClose, show = true }) {
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`${colors[type]} border-l-4 p-4 rounded-lg shadow-lg flex items-start space-x-3`}
        >
          <Icon className={`${iconColors[type]} text-xl flex-shrink-0 mt-0.5`} />
          <p className="flex-1 font-medium">{message}</p>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex-shrink-0"
            >
              <FaTimes />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
