"use client";
import React, { useEffect, useState } from "react";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import { Query } from "appwrite";

const Social = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const query = [
          Query.select([
            'facebook',
            'twitter',
            'instagram',
            'linkedin',
          ])
        ];
        // Fetch the GeneralData collection
        const response = await db.GeneralData.list();
        const documents = response.documents;

        if (documents.length === 0) {
          throw new Error("No GeneralData documents found.");
        }

        const generalData = documents[0];

        // Destructure social links from the document
        const { facebook, twitter, instagram, linkedin } = generalData;

        setSocialLinks({
          facebook: facebook || "",
          twitter: twitter || "",
          instagram: instagram || "",
          linkedin: linkedin || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching social links:", err);
        setError("Failed to load social links.");
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  if (loading) {
    return <div>Loading social icons...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Define social platforms with their respective FontAwesome classes and labels
  const socialPlatforms = [
    { name: "facebook", iconClass: "fab fa-facebook-f", label: "Facebook" },
    { name: "twitter", iconClass: "fab fa-twitter", label: "Twitter" },
    { name: "instagram", iconClass: "fab fa-instagram", label: "Instagram" },
    { name: "linkedin", iconClass: "fab fa-linkedin", label: "LinkedIn" },
  ];

  return (
    <ul className="social-icons list-inline">
      {socialPlatforms.map((platform) => {
        const link = socialLinks[platform.name];
        if (!link) return null; // Skip rendering if link is not provided

        // Ensure the link starts with http:// or https://
        const formattedLink = /^https?:\/\//i.test(link) ? link : `https://${link}`;

        return (
          <li className="list-inline-item" key={platform.name}>
            <a
              href={formattedLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.label}
            >
              <i className={platform.iconClass}></i>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Social;
