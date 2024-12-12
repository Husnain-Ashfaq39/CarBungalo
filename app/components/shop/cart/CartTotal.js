"use client";
import React from 'react';
import Link from 'next/link';
import useCartStore from '@/utils/store/cartStore';

const CartTotal = () => {
  const { items } = useCartStore();
  
  const subtotal = items.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  const shipping = 10; // You can make this dynamic if needed
  const total = subtotal + shipping;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h4 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Cart Totals</h4>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-700">
          <p className="font-medium">Subtotal</p>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-700">
          <p className="font-medium">Shipping</p>
          <span className="font-semibold">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-gray-900 font-bold border-t pt-3 mt-3">
          <p className="text-lg">Total</p>
          <span className="text-lg">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="checkout_btn">
          <Link href="/checkout" className="btn btn-thm btn-block">
            Proceed to checkout
          </Link>
        </div>
    </div>
  );
};

export default CartTotal;


       