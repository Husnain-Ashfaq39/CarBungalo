'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import db from "@/utils/appwrite/Services/dbServices"; // Update with actual data fetching logic
import storageServices from "@/utils/appwrite/Services/storageServices"
import {  Query } from "appwrite";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = [
          Query.select(['$id','name', 'price', 'discountPrice', 'images', 'isOnSale', 'bannerLabel']),
          
        ];
        const response = await db.Products.list(query); // Fetch only the necessary attributes
        const docs = response.documents;
        console.log('res', docs);

        // Use Promise.all to handle async calls within map
        const productsData = await Promise.all(docs.map(async (product) => ({
          id: product.$id,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          imageSrc: product.images ? await storageServices.images.getFileDownload(product.images[0]) : null,
          isOnSale: product.isOnSale,
          bannerLabel: product.bannerLabel
        })));

        console.log("step 2", JSON.stringify(productsData));
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <div className="col-sm-6 col-lg-4" key={product.id}>
          <div className="shop_item">
            {product.isOnSale ? <span className="bg-blue-100 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">ON SALE</span> : null}
            {product.bannerLabel ? (
              <span className="bg-red-100 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-600 " style={{ textTransform: 'uppercase' }}>
                {product.bannerLabel}
              </span>
            ) : null}
            <Link href={`/shop-single/${product.id}`} className="thumb">
              <Image
                width={248}
                height={248}
                className=""
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
                  {product.isOnSale && product.discountPrice ? (
                    <del className="ml-2 font-normal text-[#175CB7]">${product.price}</del>
                  ) : null}
                </div>
                <Link href={`/shop-single/${product.id}`} className="cart_btn float-end">
                  <Image
                    width={12}
                    height={14}
                    src="/images/shop/cart-bag.svg"
                    alt="cart-bag.svg"
                  />
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
