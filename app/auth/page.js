'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/utils/appwrite/Services/authServices";
import { addUserToCollection } from "@/utils/functions/general";
import useUserStore from "@/utils/store/userStore";
import db from "@/utils/appwrite/Services/dbServices";

const Callback = () => {
  const [isFetched, setIsFetched] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    // Prevent unnecessary re-fetching
    if (isFetched) return;

    const fetchSession = async () => {
      try {
        // Fetch the current user session from Appwrite
        const session = await getCurrentUser();
        console.log("User session:", session);

        // Add the user to the database
        await addUserToCollection(session.$id, session.name, session.email);
        console.log("User added to DB:", session);

        // Store the session and user data in localStorage
        localStorage.setItem("authToken", session.$id);
        localStorage.setItem("userId", session.$id);

        // Now fetch user data from the database
        const userData = await db.Users.get(session.$id);
        console.log("Fetched user data:", userData);

        if (!userData) {
          console.error("User data not found in database.");
          router.push("/signin"); // Redirect to signin if no user data
          return;
        }

        // Store the user and session data in Zustand store
        setUser(userData);
        setSession({ id: session.$id, userId: session.$id });

        // Update the state to prevent re-fetching and navigate to the homepage
        setIsFetched(true);
        router.push("/");
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/signin"); // Redirect to signin in case of an error
      }
    };

    fetchSession();
  }, [isFetched, router, setUser, setSession]);

  return <p>Loading...</p>;
};

export default Callback;
