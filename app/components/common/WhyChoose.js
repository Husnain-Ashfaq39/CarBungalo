import Link from "next/link";
import React from "react";
const WhyChoose = () => {
  const reasons = [
    {
      iconClass: "flaticon-trust ",
      title: "Our Mission",
      description:
        "Our stress-free finance department that can find financial solutions to save you money.",
      delay: 100,
      style: "style1",
    },
    {
      iconClass: "flaticon-car",
      title: "Services",
      description:
        "Our stress-free finance department that can find financial solutions to save you money.",
      delay: 200,
      style: "style2",
    },
    {
      iconClass: "flaticon-price-tag",
      title: "How We transform you van",
      description:
        "Our stress-free finance department that can find financial solutions to save you money.",
      delay: 300,
      style: "style3",
    },
  ];

  return (
    <>
      {reasons.map((reason, index) => (
        <div
          className="col-sm-6 col-lg-4"
          data-aos="fade-up"
          data-aos-delay={reason.delay}
          key={index}
        >
          <div className="why_chose_us home7_style"  >
            <div className={`icon ${reason.style}`}>
              <span className={reason.iconClass} />
            </div>
            <div className="details">
              <h5 className="title">{reason.title}</h5>
              <p>{reason.description}</p>
            </div>
            <Link href="/listing-v1" className="more_listing home4_style">
                Learn More{" "}
              </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default WhyChoose;
