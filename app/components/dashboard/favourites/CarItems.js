'use client';

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/app/components/shop/shop-single/pro-tab-content/WishlistButton";
import db from "@/utils/appwrite/Services/dbServices";
import { Query } from "appwrite";
import useUserStore from "@/utils/store/userStore";
import storageServices from "@/utils/appwrite/Services/storageServices";
import { EmptyWishlist } from "./EmptyWishlist";
import { motion } from 'framer-motion';

const CarItems = () => {
  // Combine related state into a single object
  const [wishlistState, setWishlistState] = useState({
    productIds: [],
    products: [],
    productImages: {},
    wishlistDoc: null,
    loading: true,
    loadingStates: {}
  });
  const { user } = useUserStore();

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchWishlist = useCallback(async () => {
    if (!user?.$id) {
      setWishlistState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const response = await db.Wishlist.list([
        Query.equal('userId', user.$id)
      ]);

      if (response.documents.length > 0) {
        const wishlistDoc = response.documents[0];
        setWishlistState(prev => ({
          ...prev,
          wishlistDoc,
          productIds: wishlistDoc.productIds
        }));
        await fetchProducts(wishlistDoc.productIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setWishlistState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  // Memoize the product fetching logic
  const fetchProducts = useCallback(async (productIds) => {
    if (!productIds.length) {
      setWishlistState(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const productQueries = [
        Query.equal('$id', productIds),
        Query.select(['$id', 'images', 'price', 'name', 'description'])
      ];

      const response = await db.Products.list(productQueries);
      
      // Fetch images in parallel
      const imagePromises = response.documents.map(async (product) => {
        if (!product.images?.length) return { productId: product.$id, imageUrl: '/images/placeholder.png' };
        
        try {
          const imageUrl = await storageServices['images'].getFileDownload(product.images[0]);
          return { productId: product.$id, imageUrl };
        } catch {
          return { productId: product.$id, imageUrl: '/images/placeholder.png' };
        }
      });

      const images = await Promise.all(imagePromises);
      const imageMap = Object.fromEntries(
        images.map(({ productId, imageUrl }) => [productId, imageUrl])
      );

      setWishlistState(prev => ({
        ...prev,
        products: response.documents,
        productImages: imageMap,
        loading: false
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      setWishlistState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const handleWishlistToggle = useCallback(async (productId) => {
    try {
      const { wishlistDoc, productIds } = wishlistState;
      if (!wishlistDoc) return;

      setWishlistState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, [productId]: true }
      }));

      const updatedIds = productIds.filter(id => id !== productId);
      const updatedWishlist = await db.Wishlist.update(wishlistDoc.$id, {
        productIds: updatedIds
      });

      setWishlistState(prev => ({
        ...prev,
        wishlistDoc: updatedWishlist,
        productIds: updatedIds,
        products: prev.products.filter(product => product.$id !== productId),
        loadingStates: { ...prev.loadingStates, [productId]: false }
      }));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      setWishlistState(prev => ({
        ...prev,
        loadingStates: { ...prev.loadingStates, [productId]: false }
      }));
    }
  }, [wishlistState]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Memoize the loading component
  const LoadingComponent = useMemo(() => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  ), []);

  if (wishlistState.loading) return LoadingComponent;
  if (!wishlistState.products.length) return <EmptyWishlist />;

  return (
    <>
      {wishlistState.products.map((product) => (
        <div className="col-sm-6 col-xl-12 col-xxl-6" key={product.$id}>
          <div className="car-listing list_style">
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  width={260}
                  height={167}
                  style={{
                    width: "260px",
                    height: "130px",
                    objectFit: "cover",
                  }}
                  priority
                  src={wishlistState.productImages[product.$id] || '/images/placeholder.png'}
                  alt={product.name}
                />
              </motion.div>
            </div>

            <div className="details">
              <div className="wrapper">
                <div className="flex items-center justify-between">
                  <h5 className="price">${product.price}</h5>
                  <div className="mb0 db_share_icons">
                    <WishlistButton
                      isWishlisted={true}
                      loading={wishlistState.loadingStates[product.$id] || false}
                      onToggle={() => handleWishlistToggle(product.$id)}
                    />
                  </div>
                </div>
                <h6 className="title">
                  <Link href={`/listing-single-v1/${product.$id}`}>{product.name}</Link>
                </h6>
                <div className="listign_review">
                  <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CarItems;