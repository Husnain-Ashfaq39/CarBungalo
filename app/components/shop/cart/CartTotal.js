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

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h4 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Cart Summary</h4>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-gray-700 py-2">
            <div className="flex space-x-1">
              <p className="font-medium">{item.name.split(' ').slice(0,2).join(' ')}</p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
            <span className="font-semibold">
              ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        
        <div className="flex justify-between items-center text-gray-900 font-bold border-t pt-3 mt-3">
          <p className="text-lg">Total</p>
          <span className="text-lg">${subtotal.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="checkout_btn">
        <Link href="/checkout" className="btn btn-thm btn-block">
          <span className="font-semibold">Proceed to checkout</span>
        </Link>
      </div>
    </div>
  );
};

export default CartTotal;