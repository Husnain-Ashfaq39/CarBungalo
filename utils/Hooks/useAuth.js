// src/hooks/useAuth.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/utils/store/userStore';
import db from "@/utils/appwrite/Services/dbServices";

const useAuth = () => {
  const router = useRouter();
  const { user, session, setUser, setSession, clearUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        console.log('Verifying session...');

        // Retrieve session data from localStorage
        const sessionId = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!sessionId || !userId) {
          throw new Error("No session found");
        }

        const userData = await db.Users.get(userId); // Adjust based on your dbServices implementation
        console.log("Fetched user data:", userData);

        // Store user and session data in Zustand store
        await setUser(userData);

        // Assuming session details can be constructed or retrieved
        // If Appwrite provides session details, adjust accordingly
        setSession({ id: sessionId, userId }); // Store session data
      } catch (error) {
        console.error('Session verification failed:', error);
        clearUser();
        router.push('/home-7'); // Redirect to login if session is invalid
      } finally {
        setLoading(false);
      }
    };

    if (!user || !session) {
      verifySession();
    } else {
      setLoading(false);
    }
  }, [user, session, setUser, setSession, clearUser, router]);

  return { user, session, loading };
};

export default useAuth;
