"use client";
import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import useCartStore from '@/utils/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

const CartItems = () => {
  const { items, removeItem, updateQuantity } = useCartStore();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  if (items.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center py-8">
          Your cart is empty
        </td>
      </tr>
    );
  }

  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.tr
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="border-bottom"
        >
          {/* Product Info */}
          <td className="pl30 py-4">
            <div className="cart_list d-flex align-items-center">
              <div className="cart_img">
                <Image
                  width={90}
                  height={90}
                  className="object-cover rounded"
                  src={item.imageSrc}
                  alt={item.name}
                />
              </div>
              <div className="cart_title ml-3">
                <h4 className="mb-0">{item.name}</h4>
              </div>
            </div>
          </td>

          {/* Price */}
          <td className="py-4">
            <div className="cart_list">
              <div className="cart_price">
                ${item.discountPrice || item.price}
              </div>
            </div>
          </td>

          {/* Quantity */}
          <td className="py-4">
            <div className="cart_list">
              <div className="quantity-group">
                <div className="input-group">
                  <button
                    className="btn btn-light px-3"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center w-16"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  />
                  <button
                    className="btn btn-light px-3"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </td>

          {/* Subtotal */}
          <td className="py-4">
            <div className="cart_list">
              <div className="cart_price">
                ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          </td>

          {/* Remove Button */}
          <td className="py-4">
            <div className="cart_list">
              <button
                onClick={() => removeItem(item.id)}
                className="cart_close btn-link text-danger bg-transparent border-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </td>
        </motion.tr>
      ))}
    </AnimatePresence>
  );
};

export default CartItems;
