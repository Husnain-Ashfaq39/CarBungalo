"use client";
import menuItems from "@/data/menuItems";
import { isParentActive } from "@/utils/isMenuActive";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ShoppingCart } from 'lucide-react';
import useCartStore from '@/utils/store/cartStore';
import { motion, AnimatePresence } from "framer-motion";
import {
    ProSidebarProvider,
    Sidebar,
    Menu,
    MenuItem,
    SubMenu,
} from "react-pro-sidebar";

const MobileMenu = () => {
    const path = usePathname();
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

    const socialLinks = [
        {
            name: "Facebook",
            icon: "fab fa-facebook-f",
            link: "#",
        },
        {
            name: "Twitter",
            icon: "fab fa-twitter",
            link: "#",
        },
        {
            name: "Instagram",
            icon: "fab fa-instagram",
            link: "#",
        },
        {
            name: "YouTube",
            icon: "fab fa-youtube",
            link: "#",
        },
        {
            name: "Pinterest",
            icon: "fab fa-pinterest",
            link: "#",
        },
    ];

    const contactInfo = [
        {
            icon: "flaticon-map",
            text: "47 Bakery Street, London, UK",
        },
        {
            icon: "flaticon-phone-call",
            text: "1-800-458-56987",
        },
        {
            icon: "flaticon-clock",
            text: "Mon - Fri 8:00 - 18:00",
        },
    ];

    return (
        <>
            <div className="stylehome1 h0">
                <div className="mobile-menu">
                    <div className="header stylehome1">
                        <div className="mobile_menu_bar">
                            <a
                                className="menubar"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#mobileMenu"
                                aria-controls="mobileMenu"
                            >
                                <small>Menu</small>
                                <span />
                            </a>
                        </div>
                        {/* End mobile_menu_bar */}
                        <div className="d-flex justify-content-between align-items-center w-75 px-1">

                        <div className="mobile_menu_main_logo">
                            <Image
                                width={140}
                                height={45}
                                priority
                                src="/images/header-logo2.svg"
                                alt="brand"
                            />
                        </div>
                        {/* End .mobile_menu_main_logo */}

                        {/* Add Cart Icon */}
                        <div className="mobile_menu_cart_icon">
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
                                            className="w-6 h-6 transition-colors duration-300 group-hover:text-primary" 
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
                                </Link>
                            </motion.div>
                        </div>
                        </div>
                    </div>
                </div>
                {/* /.mobile-menu */}
            </div>
            {/* End mobile menu header */}

            {/* start mobile sidebar menu */}
            <div
                className="offcanvas offcanvas-end mobile_menu-canvas"
                tabIndex="-1"
                id="mobileMenu"
                aria-labelledby="mobileMenuLabel"
                data-bs-scroll="true"
            >
                <div className="offcanvas-body">
                    <div className="pro-header">
                        <Link href="/">
                            <Image
                                width={140}
                                height={45}
                                priority
                                src="/images/header-logo.svg"
                                alt="brand"
                            />
                        </Link>
                        <div
                            className="fix-icon"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        >
                            <i className="fa-light fa-circle-xmark"></i>
                        </div>
                    </div>
                    {/* End pro-header */}

                    {/* mobile menu items start */}
                    <ProSidebarProvider>
                        <Sidebar
                            width="100%"
                            backgroundColor="#0A2357"
                            className="my-custom-class"
                        >
                            <Menu>
                                {menuItems.map((item, index) => (
                                    <SubMenu
                                        key={index}
                                        className={
                                            isParentActive(item.subMenu, path)
                                                ? "active"
                                                : ""
                                        }
                                        label={item.label}
                                    >
                                        {item?.subMenu?.map((subItem, subIndex) =>
                                            subItem.subMenu ? (
                                                <SubMenu
                                                    key={subIndex}
                                                    label={subItem.label}
                                                    className={
                                                        isParentActive(
                                                            subItem.subMenu,
                                                            path
                                                        )
                                                            ? "active"
                                                            : ""
                                                    }
                                                >
                                                    {subItem.subMenu.map(
                                                        (
                                                            nestedItem,
                                                            nestedIndex
                                                        ) => (
                                                            <MenuItem
                                                                key={
                                                                    nestedIndex
                                                                }
                                                                component={
                                                                    <Link
                                                                        className={
                                                                            nestedItem.path ==
                                                                            path
                                                                                ? "active"
                                                                                : ""
                                                                        }
                                                                        href={
                                                                            nestedItem.path
                                                                        }
                                                                    />
                                                                }
                                                            >
                                                                {
                                                                    nestedItem.label
                                                                }
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </SubMenu>
                                            ) : (
                                                <MenuItem
                                                    key={subIndex}
                                                    component={
                                                        <Link
                                                            className={
                                                                subItem.path ==
                                                                path
                                                                    ? "active"
                                                                    : ""
                                                            }
                                                            href={subItem.path}
                                                        />
                                                    }
                                                >
                                                    {subItem.label}
                                                </MenuItem>
                                            )
                                        )}
                                    </SubMenu>
                                ))}
                            </Menu>
                        </Sidebar>
                    </ProSidebarProvider>
                    {/* mobile menu items end */}

                    <div className="pro-footer mm-add-listing">
                        <div className="border-none">
                            <div className="mmenu-contact-info">
                                {contactInfo.map((info, index) => (
                                    <span className="phone-num" key={index}>
                                        <i className={info.icon} />{" "}
                                        <a href="#">{info.text}</a>
                                    </span>
                                ))}
                            </div>

                            <div className="social-links">
                                {socialLinks.map((link, index) => (
                                    <a href={link.link} key={index}>
                                        <span className={link.icon} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* End mm-add-listng */}
                </div>
                {/* End offcanvas-body */}
            </div>
            {/* End mobile sidebar menu */}
        </>
    );
};

export default MobileMenu;
