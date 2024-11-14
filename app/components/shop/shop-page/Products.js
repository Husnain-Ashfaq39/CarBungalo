/* eslint-disable react/prop-types */
"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import db from "@/utils/appwrite/Services/dbServices";
import storageServices from "@/utils/appwrite/Services/storageServices";
import { Query } from "appwrite";

const Products = ({ filter, categoryFilter }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = [
          Query.select([
            '$id',
            'name',
            'price',
            'discountPrice',
            'images',
            'isOnSale',
            'bannerLabel',
            'categoryId',
            '$createdAt'
          ])
        ];

        const response = await db.Products.list(query);
        const docs = response.documents;
        console.log("Res "+JSON.stringify(docs[0]));
        

        const productsData = await Promise.all(
          docs.map(async (product) => ({
            id: product.$id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            imageSrc: product.images
              ? await storageServices.images.getFileDownload(product.images[0])
              : null,
            isOnSale: product.isOnSale,
            bannerLabel: product.bannerLabel,
            categoryId: product.categoryId,
            createdAt: product.$createdAt
          }))
        );
        

        setAllProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on categoryFilter and sort them based on filter
    let filtered = allProducts;

    if (categoryFilter) {
      filtered = filtered.filter((product) => 
        Array.isArray(categoryFilter)
          ? categoryFilter.includes(product.categoryId)
          : product.categoryId === categoryFilter
      );
    }

    if (filter === "price-asc") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (filter === "price-desc") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (filter === "recent") {
      filtered = filtered.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    setFilteredProducts(filtered);
  }, [allProducts, filter, categoryFilter]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      {filteredProducts.map((product) => (
        <div className="col-sm-6 col-lg-4" key={product.id}>
          <div className="shop_item">
            {product.isOnSale && (
              <span className="bg-blue-100 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                ON SALE
              </span>
            )}
            {product.bannerLabel && (
              <span
                className="bg-red-100 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-600"
                style={{ textTransform: 'uppercase' }}
              >
                {product.bannerLabel}
              </span>
            )}
            <Link href={`/shop-single/${product.id}`} className="thumb">
              <Image
                width={248}
                height={248}
                style={{ objectFit: "cover", width: "100%", height: "220px" }}
                loading="lazy"
                src={product.imageSrc}
                alt={product.name}
              />
            </Link>
            <div className="details mt-4">
              <div className="si_footer">
                <div className="price float-start">
                  ${product.discountPrice || product.price}
                  {product.isOnSale && product.discountPrice && (
                    <del className="ml-2 font-normal">${product.price}</del>
                  )}
                </div>
                <Link href={`/shop-single/${product.id}`} className="cart_btn float-end">
                  <Image width={12} height={14} src="/images/shop/cart-bag.svg" alt="cart-bag.svg" />
                </Link>
              </div>
            </div>
            <div className="name">
              <Link href={`/shop-single/${product.id}`}>{product.name}</Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Products;
