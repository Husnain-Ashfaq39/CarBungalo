"use client";
import Link from "next/link";
import MainMenu from "./MainMenu";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/utils/store/cartStore';
import { motion, AnimatePresence } from "framer-motion";

const DefaultHeader = () => {
  const { items } = useCartStore();
  const cartQuantity = items.length;
  const [isPulsing, setIsPulsing] = useState(false);

  // Watch for cart changes and trigger pulse animation
  useEffect(() => {
    if (cartQuantity > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartQuantity]);

  return (
    <header className="header-nav menu_style_home_one home3_style main-menu">
      <nav>
        <div className="container posr">
          {/* Menu Toggle btn*/}
          <div className="menu-toggle">
            <button type="button" id="menu-btn">
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
          </div>
          <Link href="/" className="navbar_brand float-start dn-md">
            <Image
              width={140}
              height={45}
              className="logo1 img-fluid"
              src="/images/header-logo2.svg"
              alt="header-logo.svg"
            />
            <Image
              width={140}
              height={45}
              className="logo2 img-fluid"
              src="/images/header-logo2.svg"
              alt="header-logo2.svg"
            />
          </Link>
          {/* Responsive Menu Structure*/}
          <ul
            className="ace-responsive-menu text-end"
            data-menu-style="horizontal"
          >
            <MainMenu />
            <li className="add_listing">
              <Link href="/add-listings">+ Build your Car</Link>
            </li>
            <li className="cart_icon">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/cart" 
                  className="relative inline-flex items-center p-2 group"
                >
                  <motion.div
                    animate={isPulsing ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <ShoppingCart 
                      className="w-6 h-6 transition-colors duration-300 group-hover:text-primary mb-[-5px]" 
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {cartQuantity > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold border-2 border-white shadow-md"
                      >
                        {cartQuantity > 99 ? '99+' : cartQuantity}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 bg-white px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50 whitespace-nowrap"
                  >
                    {cartQuantity === 0 ? 'Your cart is empty' : `${cartQuantity} items in cart`}
                  </motion.div>
                </Link>
              </motion.div>
            </li>
            <li
              className="sidebar_panel"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <a className="sidebar_switch pt0" role="button">
                <span />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default DefaultHeader;
