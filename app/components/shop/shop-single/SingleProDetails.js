'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import storageServices from "@/utils/appwrite/Services/storageServices";
import db from "@/utils/appwrite/Services/dbServices";
import { Query } from "appwrite";
import useUserStore from "@/utils/store/userStore";
import { WishlistButton } from "./pro-tab-content/WishlistButton";

const SingleProDetails = ({ productData }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistDoc, setWishlistDoc] = useState(null);
  const { user } = useUserStore();

  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to add items to wishlist");
      return;
    }

    setLoading(true);
    try {
      if (wishlistDoc) {
        const productIds = wishlistDoc.productIds || [];
        
        if (isWishlisted) {
          const updatedIds = productIds.filter(id => id !== productData.$id);
          const updatedWishlist = await db.Wishlist.update(wishlistDoc.$id, {
            productIds: updatedIds
          });
          setWishlistDoc(updatedWishlist);
          setIsWishlisted(false);
        } else {
          const updatedIds = [...productIds, productData.$id];
          const updatedWishlist = await db.Wishlist.update(wishlistDoc.$id, {
            productIds: updatedIds
          });
          setWishlistDoc(updatedWishlist);
          setIsWishlisted(true);
        }
      } else {
        console.log("User ID:", user.$id);
        console.log("Product ID:", productData.$id);
        
        const newWishlist = await db.Wishlist.create({
          userId: user.$id,
          productIds: [productData.$id]
        });
        setWishlistDoc(newWishlist);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user || !productData) return;

      try {
        const response = await db.Wishlist.list([
          Query.equal('userId', user.$id)
        ]);

        if (response?.total > 0 && response?.documents?.length > 0) {
          const wishlist = response.documents[0];
          setWishlistDoc(wishlist);
          const productIds = wishlist.productIds || [];
          setIsWishlisted(productIds.includes(productData.$id));
        } else {
          setWishlistDoc(null);
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setWishlistDoc(null);
        setIsWishlisted(false);
      }
    };

    checkWishlistStatus();
  }, [user, productData]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (productData && productData.images) {
        try {
          const urls = await Promise.all(
            productData.images.map(async (imageId) => {
              const url = await storageServices['images'].getFileDownload(imageId);
              return url; // Assuming getFileDownload returns a URL object
            })
          );
          setImageUrls(urls);
        } catch (error) {
          console.error("Error fetching image URLs:", error);
        }
      }
    };

    const fetchCategoryName = async () => {
      if (productData?.categoryId) {
        try {
          const response = await db.Categories.list([
            Query.equal('$id', productData.categoryId)
          ]);
         
          
          if (response.documents.length > 0) {
            
            
            setCategoryName(response.documents[0].name);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      }
    };

    fetchImageUrls();
    fetchCategoryName();
  }, [productData]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
  };

  if (!productData) {
    return <div>Loading...</div>; // Handle loading state
  }

  const { name, discountPrice, description, price, stock, sku, categoryId, tags } = productData;

  return (
    <>
      <div className="col-lg-6 mb-5">
        <div className="single_product_grid">
          <div className="sps_content">
            <div className="thumb">
              <div className="single_product">
                <div className="single_item">
                  <div className="thumb relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {imageUrls.length > 0 ? (
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -300 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            width={508}
                            height={508}
                            className="object-cover w-full h-full img-fluid"
                            src={imageUrls[currentImageIndex]}
                            alt={name}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            width={508}
                            height={508}
                            className="object-cover w-full h-full img-fluid"
                            src="/images/shop/ss1.png"
                            alt="default"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {imageUrls.length > 1 && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white hover:bg-gray-100 shadow-md text-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200"
                          onClick={handlePrevImage}
                          aria-label="Previous image"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="transform rotate-180"
                          >
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white hover:bg-gray-100 shadow-md text-gray-700 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-200"
                          onClick={handleNextImage}
                          aria-label="Next image"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End product image */}

      <div className="col-lg-6">
        <div className="shop_single_product_details p0-414">
          <h3 className="title">{name}</h3>
          <p className="mb25" dangerouslySetInnerHTML={{ __html: description }}></p>
          <div className="sspd_price mb30">
            {discountPrice ? (
              <>
                <span>${discountPrice}</span>
                <small>
                  <del className="ml10">${price}</del>
                </small>
              </>
            ) : (
              <span>${price}</span>
            )}
          </div>
          <ul className="cart_btns instock_area mb30">
            <li className="list-inline-item">
              <input placeholder={4} type="number" />
            </li>
            <li className="list-inline-item">
              <span className="fa fa-check-circle text-green-500 ml10 mr5 fz18 " />{" "}
              {stock} in stock
            </li>
          </ul>
          <ul className="cart_btns wishlist_compare mb20 flex items-center">
            <li className="list-inline-item">
              <button type="button" className="btn btn-thm">
                <Image
                  className="mr10"
                  src="/images/shop/cart-bag.svg"
                  alt="cart-bag.svg"
                  width={20}
                  height={20}
                />
                Add to Cart
              </button>
            </li>
            <li className="list-inline-item">
          <WishlistButton 
            isWishlisted={isWishlisted}
            loading={loading}
            onToggle={handleWishlistToggle}
          />
        </li>
          </ul>
          <ul className="sspd_sku">
            <li>
              <a href="#">SKU:</a> <span>{sku}</span>
            </li>
            <li>
              <a href="#">Categories:</a> <span>{categoryName}</span>
            </li>
            <li>
              <a href="#">Tags:</a> <span>{tags.join(' , ')}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SingleProDetails;
