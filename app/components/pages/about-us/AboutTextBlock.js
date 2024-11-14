"use client";
import Image from "next/image";
import React,{useState,useEffect} from "react";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import storageServices from "@/utils/appwrite/Services/storageServices";

const AboutTextBlock = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Fetch all documents from the AboutUs collection
        const response = await db.AboutUs.list();
        const documents = response.documents;

        if (documents.length === 0) {
          throw new Error("No About Us data found.");
        }

        // Assuming you have only one AboutUs document. Adjust if multiple.
        const doc = documents[0];
        const { title, content, imageId } = doc;

        // Fetch the image URL using storageServices
        const imageUrl = await storageServices.images.getFileView(imageId);

        setAboutData({
          title,
          content,
          image: imageUrl,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching About Us data:", err);
        setError("Failed to load About Us section.");
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div>Loading About Us section...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div className="col-lg-6">
        <div className="about_thumb mb30-md">
          <Image
            width={636}
            height={667}
            priority
            style={{ objectFit: "cover" }}
            className="thumb1"
            src={aboutData.image}
            alt="1.jpg"
          />
        
        </div>
      </div>
      {/* End .col */}
      <div className="col-lg-5 offset-lg-1 lg:mt-[-120px]">
        <div className="about_content">
          <h2 className="title">{aboutData.title}</h2>
          <p className="mb30">
          {aboutData.content}
          </p>
        </div>
      </div>
      {/* End .col */}
    </>
  );
};

export default AboutTextBlock;
