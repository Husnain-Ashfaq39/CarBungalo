'use client'

import { Heart, HeartCrack } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WishlistButton({ isWishlisted, loading, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={loading}
      className="relative w-10 h-10 rounded-full bg-white hover:bg-gray-50 shadow-md flex items-center justify-center"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <AnimatePresence mode="wait">
        {isWishlisted ? (
          <motion.div
            key="filled"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-5 h-5 text-red-500 fill-current" />
          </motion.div>
        ) : (
          <motion.div
            key="outline"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.3 }}
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading && (
        <motion.div
          className="absolute inset-0 rounded-full bg-black/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.button>
  );
}