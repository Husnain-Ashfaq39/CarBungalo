"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import db from "@/utils/appwrite/Services/dbServices";
import storageServices from "@/utils/appwrite/Services/storageServices";
import { Query } from "appwrite";
import useCartStore from '@/utils/store/cartStore';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShoppingCart } from 'lucide-react';

const Products = ({ filter, categoryFilter, searchTerm, currentPage, itemsPerPage }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addItem, items } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = [
          Query.select([
            "$id",
            "name",
            "price",
            "discountPrice",
            "images",
            "isOnSale",
            "bannerLabel",
            "categoryId",
            "$createdAt",
          ]),
        ];

        if (searchTerm.trim() !== "") {
          query.push(Query.search("name", `*${searchTerm}*`));
        }

        if (categoryFilter && categoryFilter.length > 0) {
          query.push(Query.equal("categoryId", categoryFilter));
        }

        const response = await db.Products.list(query);
        const docs = response.documents;

        const productsData = await Promise.all(
          docs.map(async (product) => ({
            id: product.$id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            imageSrc: product.images
              ? await storageServices.images.getFileDownload(product.images[0])
              : "/images/placeholder.png",
            isOnSale: product.isOnSale,
            bannerLabel: product.bannerLabel,
            categoryId: product.categoryId,
            createdAt: product.$createdAt,
          }))
        );

        setAllProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    let sorted = [...allProducts];

    if (filter === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (filter === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (filter === "recent") {
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filter === "default") {
      sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    setFilteredProducts(sorted);
  }, [allProducts, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    
    if (isInCart(product.id)) {
      toast.info("Item is already in your cart!");
      return;
    }
    
    addItem(product);
    toast.success("Item added to cart successfully!");
  };

  const isInCart = (productId) => {
    return items.some(item => item.id === productId);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  if (currentProducts.length === 0) {
    return <div className="text-center mt-10">No products found.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <div className="shop_item" key={product.id}>
            <div className="relative">
              {product.isOnSale && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  ON SALE
                </span>
              )}
              {product.bannerLabel && (
                <span
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-0.5 rounded-full uppercase"
                >
                  {product.bannerLabel}
                </span>
              )}
              <Link href={`/shop-single/${product.id}`} className="block">
                <Image
                  width={248}
                  height={248}
                  className="object-cover w-full h-56"
                  loading="lazy"
                  src={product.imageSrc || "/images/placeholder.png"}
                  alt={product.name}
                />
              </Link>
            </div>
            <div className="details mt-4">
              <div className="flex justify-between items-center">
                <div className="price text-lg font-semibold">
                  ${product.discountPrice || product.price}
                  {product.isOnSale && product.discountPrice && (
                    <del className="ml-2 text-gray-500">${product.price}</del>
                  )}
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`cart_btn p-2 rounded-full transition-colors ${
                    isInCart(product.id) ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  aria-label={isInCart(product.id) ? "Item in cart" : "Add to cart"}
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
              <div className="name mt-2">
                <Link href={`/shop-single/${product.id}`} className="text-gray-800 hover:text-blue-600">
                  {product.name}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer closeButton={false} limit={1} />
    </>
  );
};

export default Products;

