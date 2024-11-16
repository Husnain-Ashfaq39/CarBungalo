// src/hooks/useAuth.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useUserStore from '@/utils/store/userStore';
import { getCurrentUser } from '@/utils/appwrite/Services/authServices'; // Adjust the import path as needed

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

        // Fetch the current user account from Appwrite
        const currentUser = await getCurrentUser(); // Retrieves the current user
        console.log('Current User:', currentUser);
        setUser(currentUser); // Store user data

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
