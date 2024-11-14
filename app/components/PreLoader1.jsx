import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';

export default function Component() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const newProgress = oldProgress + 1;
        return Math.min(newProgress, 100);
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const progressVariants = {
    initial: { width: 0 },
    animate: { width: `${progress}%` },
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#1e3a8a] to-[#0f172a]">
      <AnimatePresence>
        <motion.div
          className="relative w-96 flex flex-col items-center"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="w-full h-2 bg-[#2a4a8a] rounded-full overflow-hidden mb-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#f0c14b] to-[#f59e0b]"
              variants={progressVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </motion.div>
          <div className="flex justify-between w-full text-white">
            <motion.span
              className="text-sm font-medium"
              variants={textVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Loading your perfect holiday home
            </motion.span>
            <motion.span
              className="text-sm font-bold"
              variants={textVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {progress}%
            </motion.span>
          </div>
          <motion.div
            className="mt-8 flex items-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Car className="text-[#f0c14b] w-6 h-6" />
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#f0c14b] rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
