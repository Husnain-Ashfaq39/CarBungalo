// src/app/pages/service/Service.jsx
"use client"
import React, { useEffect, useState } from "react";
import Footer from "@/app/components/home/home-7/Footer";
import DefaultHeader from "../../components/common/DefaultHeader";
import HeaderSidebar from "../../components/common/HeaderSidebar";
import MobileMenu from "../../components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import ServiceBlock from "@/app/components/pages/service/ServiceBlock";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices"; // Adjust the import path as needed

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        
        // Fetch all services from the Services collection
        const servicesData = await db.Services.list();

        // For each service, fetch the image URL from storage
        const servicesWithImages = await Promise.all(
          servicesData.documents.map(async (service) => {
            try {
              const file = await storageServices.images.getFileDownload(service.image_id);
              // Assuming getFileDownload returns an object with a `href` property
              console.log('this is file '+file);
              
              const imageUrl = file; 
              return { ...service, imageUrl };
            } catch (imgError) {
              console.error(`Error fetching image for service ${service.$id}:`, imgError);
              return { ...service, imageUrl: "/images/default-service.jpg" }; // Fallback image
            }
          })
        );
        setLoading(false);

        setServices(servicesWithImages);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="wrapper">
        <DefaultHeader />
        <MobileMenu />
        <div className="container text-center my-5">
          <p>Loading services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wrapper">
        <DefaultHeader />
        <MobileMenu />
        <div className="container text-center my-5">
          <p>{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>
      {/* Sidebar Panel End */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      {/* Inner Page Breadcrumb */}
      <section className="inner_page_breadcrumb style2 bgc-f9 bt1">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="breadcrumb_content style2">
                <h2 className="breadcrumb_title">Service</h2>
                <p className="subtitle">Service</p>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Service
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Section Area */}
      <div className="container">
        <ServiceBlock services={services} />
      </div>
      <div style={{ height: "100px" }}></div>

      <Footer />
      {/* End Our Footer */}

      {/* Modal */}
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LoginSignupModal />
      </div>
      {/* End Modal */}
    </div>
    // End wrapper
  );
};

export default Service;
