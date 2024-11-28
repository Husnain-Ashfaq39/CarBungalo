// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { account } from "../../lib/appwrite";
import React from "react";
const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await account.get(); // Get user session
        console.log("User session:", session);
        router.push("/"); 
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/signin");
      }
    };

    fetchSession();
  }, [router]);

  return <p>Loading...</p>;
};

export default Callback;
