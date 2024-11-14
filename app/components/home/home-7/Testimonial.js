"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore, { Navigation, Pagination } from "swiper";
import Image from "next/image";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed

SwiperCore.use([Navigation, Pagination]);




const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Fetch all documents from the Testimonials collection
        const response = await db.testimonials.list(); // Adjust the collection name if different
        const documents = response.documents;

        // For each document, fetch the profile picture and car image URLs
        const testimonialsWithImages = await Promise.all(
          documents.map(async (doc) => {
            const { name, content, profilePicId, imageId } = doc;

            // Fetch the profile picture URL
            const profilePicUrl = await storageServices.images.getFileView(profilePicId);

            // Fetch the car image URL
            const carImageUrl = await storageServices.images.getFileView(imageId);

            return {
              name,
              content,
              profilePic: profilePicUrl,
              carImage: carImageUrl,
            };
          })
        );

        setTestimonials(testimonialsWithImages);
        setTotalSlides(testimonialsWithImages.length);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to load testimonials.");
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const { activeIndex, slides } = swiperRef.current.swiper;
      if (activeIndex < slides.length - 1) {
        swiperRef.current.swiper.slideNext();
      }
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const { activeIndex } = swiperRef.current.swiper;
      if (activeIndex > 0) {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };

  const handleSlideChange = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const { realIndex, slides } = swiperRef.current.swiper;
      setCurrentSlide(realIndex + 1);
      setTotalSlides(slides.length);
    }
  };

  return (
    <div>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={30}
        onSlideChange={handleSlideChange}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            {/* Parent container with flex display */}
            <div className="testimonial-container flex flex-col lg:flex-row items-start gap-10">
              {/* Image Section */}
              <div
                key={index}
                data-aos="fade-up"
                className="partner_item lg:w-1/2 w-full"
              >
                <Image
                  src={testimonial.carImage}
                  width={700}
                  height={250}
                  className="rounded-2xl object-cover w-full h-full"
                  alt="Car Image"
                />
              </div>

              {/* Testimonial Content */}
              <div className="testimonial_home4_slider flex-grow m-4 lg:m-0">
                <div className="tst_thumb_content flex items-center mb-3">
                  <div className="thumb me-4 w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src={testimonial.profilePic}
                      alt="Testimonial Image"
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="tst_client text-start">
                    <h5 className="title my-1 text-lg font-semibold">{testimonial.name}</h5>
                    <p className="para text-sm text-gray-600">{testimonial.designation}</p>
                  </div>
                </div>
                <div className="tst_details text-start">
                  <p className="para text-base text-gray-700">{testimonial.content}</p>
                </div>
              </div>
            </div>

          </SwiperSlide>

        ))}
      </Swiper>

      {/* Navigation */}
      <div className="d-flex pt-5 ml-6">
        <div
          className={`custom-prev-arrow pointer${currentSlide === 1 ? " disabled" : ""
            }`}
          onClick={handlePrev}
        >
          <i className="flaticon-left-arrow"></i>
        </div>
        {/* End prev */}

        <div className="px-4">
          <div className="swiper-pagination-total">
            {currentSlide} / {totalSlides}
          </div>
        </div>
        {/* End Pagination */}

        <div
          className={`custom-next-arrow pointer${currentSlide === totalSlides ? " disabled" : ""
            }`}
          onClick={handleNext}
        >
          <i className="flaticon-right-arrow"></i>
        </div>
        {/* End next */}
      </div>
    </div>
  );
};

export default Testimonial;
