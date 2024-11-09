/* eslint-disable react/prop-types */
// src/app/components/pages/service/ServiceBlock.jsx
import Image from "next/image";
import React from "react";

const ServiceBlock = ({ services }) => {
  return (
    <>
      {services.map((service, index) => (
        <div className="row mt120 mt50-sm" key={service.$id}>
          {/* Alternating layout for odd and even services */}
          {index % 2 === 0 ? (
            <>
              <div className="col-md-6 col-xl-5">
                <div className="service_thumb mb30-sm">
                  <Image
                    width={526}
                    height={354}
                    priority
                    layout="responsive"
                    src={service.imageUrl}
                    alt={service.title}
                  />
                </div>
              </div>
              <div className="col-md-6 col-xl-5 offset-xl-1">
                <div className="service_include2 mt0-md">
                  <h3 className="title">{service.title}</h3>
                  <p className="para">{service.content}</p>
                 
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-6 col-xl-5">
                <div className="service_include2 mt0-md mb30-sm">
                  <h3 className="title">{service.title}</h3>
                  <p className="para">{service.content}</p>
                </div>
              </div>
              <div className="col-md-6 col-xl-5 offset-xl-1">
                <div className="service_thumb">
                  <Image
                    width={526}
                    height={354}
                    priority
                    layout="responsive"
                    src={service.imageUrl}
                    alt={service.title}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default ServiceBlock;
