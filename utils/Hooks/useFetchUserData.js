import { useEffect, useState } from "react";
import dbServices from "@/utils/appwrite/Services/dbServices";

const useFetchUserData = (userId) => {
  const [userData, setUserData] = useState({ name: "", location: "", email: "", telephone: "" });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await dbServices.Users.get(userId);
        setUserData({
          name: userDoc.name || "",
          location: userDoc.location || "",
          email: userDoc.email || "",
          telephone: userDoc.telephone || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  return { userData, error };
};

export default useFetchUserData; 