"use client";
import React, { useEffect, useState } from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed

const Hero = () => {
  const [carSlides, setCarSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Fetch all documents from the HeroSection collection
        const response = await db.HeroSection.list();
        const documents = response.documents;

        // For each document, fetch the corresponding image URL
        const slidesWithImages = await Promise.all(
          documents.map(async (doc) => {
            const { title, subtitle, imageId } = doc;
            // Fetch the image URL using storageServices
            const imageUrl = await storageServices.images.getFileView(imageId);
           
          

            return {
              title,
              subtitle,
              image: imageUrl,
            };
          })
        );

        setCarSlides(slidesWithImages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching hero data:", err);
        setError("Failed to load hero section.");
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return <div>Loading hero section...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="row">
      <div className="col-lg-12 m-auto">
        <div className="home_content_home7_slider">
          <div className="listing_item_1grid_slider">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              modules={[Navigation]}
              navigation={{
                nextEl: ".p4-arrow-next",
                prevEl: ".p4-arrow-prev",
              }}
            >
              {carSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="item">
                    <div className="home_content_home7">
                      <div className="wrapper text-center">
                        <h2 className="title">
                          <Link href="/listing-single-v1">
                          { slide.title}
                          </Link>
                        </h2>
                        <h3 className="subtitle text-thm">
                          <span className="aminated-object1">
                            <Image
                              width={110}
                              height={14}
                              style={{
                                objectFit: "contain",
                              }}
                              priority
                              className="objects"
                              src="/images/home/title-bottom-border.svg"
                              alt="img"
                            />
                          </span>
                          {slide.subtitle}
                        </h3>
                        <div className="d-flex justify-content-center">
                          <Link
                            className="btn btn1 btn-thm2 mr20"
                            href="/listing-single-v2"
                          >
                            Get a Quote
                          </Link>
                          <Link
                            className="btn btn2 btn-thm"
                            href="/listing-single-v3"
                          >
                            See Results
                          </Link>
                        </div>
                      </div>
                      <div className="thumb">
                      <Image
                          width={850}
                          height={335}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                          src={slide.image}
                          alt="car large"
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              {/* start navigation  */}
              <div className="arrow-70-plus white-arrow_btn d-none d-sm-block">
                <div className="slider-arrow-center">
                  <button className="prev p4-arrow-prev">
                    <i className="flaticon-left-arrow"></i>
                  </button>
                  <button className="next p4-arrow-next">
                    <i className="flaticon-right-arrow"></i>
                  </button>
                </div>
              </div>

              {/* End navigation */}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
