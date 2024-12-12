"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, memo } from "react";
import db from "@/utils/appwrite/Services/dbServices";
import storageServices from "@/utils/appwrite/Services/storageServices";
import { Query } from "appwrite";

// Separate ProductCard component for better performance
const ProductCard = memo(({ product, imageUrl }) => (
  <div className="item">
    <div className="shop_item">
      <Link href={`/shop-single/${product.$id}`} className="thumb">
        <div style={{ width: "248px", height: "248px" }}>
          <Image
            width={248}
            height={248}
            src={imageUrl || "/images/shop/1.png"}
            alt={product.name}
            className="object-cover w-full h-full"
            loading="lazy"
            placeholder="blur"
            blurDataURL="/images/shop/1.png"
          />
        </div>
      </Link>
      <div className="details">
        <div className="title mt-3">
          <Link href={`/shop-single/${product.$id}`}>{product.name}</Link>
        </div>

        <div className="si_footer">
          <div className="price float-start">
            {product.discountPrice && (
              <small>
                <del>${product.price}</del>
              </small>
            )}
            ${product.discountPrice || product.price}
          </div>
          <Link href={`/shop-single/${product.$id}`} className="cart_btn float-end">
            <Image
              width={12}
              height={14}
              src="/images/shop/cart-bag.svg"
              alt="cart-bag.svg"
            />
          </Link>
        </div>
      </div>
    </div>
  </div>
));

ProductCard.displayName = 'ProductCard';

// Memoized Swiper settings
const swiperBreakpoints = {
  320: { slidesPerView: 1 },
  640: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1068: { slidesPerView: 4 },
};

const RelatedProducts = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  const fetchProductImage = useCallback(async (product) => {
    if (product.images?.[0]) {
      try {
        const url = await storageServices['images'].getFileDownload(product.images[0]);
        return { productId: product.$id, url };
      } catch (error) {
        console.error(`Error fetching image for product ${product.$id}:`, error);
      }
    }
    return { productId: product.$id, url: '/images/shop/1.png' };
  }, []);

  const fetchRelatedProducts = useCallback(async () => {
    try {
      const relatedProducts = await db.Products.list([
        Query.equal('categoryId', categoryId),
        Query.limit(6)
      ]);

      setProducts(relatedProducts.documents);

      // Fetch images in parallel
      const images = await Promise.all(
        relatedProducts.documents.map(fetchProductImage)
      );

      setProductImages(
        images.reduce((acc, { productId, url }) => ({
          ...acc,
          [productId]: url
        }), {})
      );
    } catch (error) {
      console.error("Error fetching related products:", error);
      setProducts([]);
    }
  }, [categoryId, fetchProductImage]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [fetchRelatedProducts]);

  if (!products.length) return null;

  return (
    <>
      <Swiper
        spaceBetween={20}
        speed={1000}
        modules={[Pagination]}
        pagination={{
          el: ".shop-related-pagination",
          spaceBetween: 10,
          clickable: true,
        }}
        breakpoints={swiperBreakpoints}
      >
        {products.map((product) => (
          <SwiperSlide key={product.$id}>
            <ProductCard 
              product={product} 
              imageUrl={productImages[product.$id]} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-3 text-center">
        <div className="shop-related-pagination" />
      </div>
    </>
  );
};

export default memo(RelatedProducts);
