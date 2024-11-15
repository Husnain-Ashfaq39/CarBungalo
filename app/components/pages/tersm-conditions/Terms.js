"use client";

import React, { useEffect, useState } from "react";
import db from "@/utils/appwrite/Services/dbServices"; // Adjust the import path as needed
import { Query } from "appwrite";

const Terms = () => {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // Use Query to select only the 'terms' field
        const query = [Query.select(['terms'])];

        // Fetch the GeneralData collection with the query
        const response = await db.GeneralData.list(query);
        const documents = response.documents;

        if (documents.length === 0) {
          throw new Error("No GeneralData documents found.");
        }

        const generalData = documents[0];

        // Get the 'terms' from the document
        const { terms } = generalData;

        setTerms(terms || "");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching terms:", err);
        setError("Failed to load terms.");
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return <div>Loading terms...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-4">
      <div
        dangerouslySetInnerHTML={{ __html: terms }}
      />
    </div>
  );
};

export default Terms;
