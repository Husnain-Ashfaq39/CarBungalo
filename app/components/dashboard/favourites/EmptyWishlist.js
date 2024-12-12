'use client';

import { Heart } from 'lucide-react';

export const EmptyWishlist = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#F5C34B] to-[#1A3760] rounded-full opacity-75 blur"></div>
        <div className="relative bg-white dark:bg-gray-900 rounded-full p-4">
          <Heart className="w-12 h-12 text-[#F5C34B]" />
        </div>
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-gray-900">
        Your wishlist is empty
      </h3>
      <p className="mt-2 text-center text-gray-500 dark:text-gray-400 max-w-sm">
        Start adding items to your wishlist by clicking the heart icon on products you love.
      </p>
    </div>
  );
};