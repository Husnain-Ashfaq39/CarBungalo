// useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null, 
      session: null, 
      setUser: (userData) => set({ user: userData }),
      setSession: (sessionData) => set({ session: sessionData }),
      clearUser: () => {
        console.log('clearUser called');
        localStorage.removeItem('authToken'); // Clear session token
        localStorage.removeItem('userId');
        set({ user: null, session: null })},
    }),
    {
      name: 'user-storage', 
      getStorage: () => localStorage, 
    }
  )
);

export default useUserStore;
