// useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null, // Holds the user data
      session: null, // Holds session data (e.g., tokens)
      setUser: (userData) => set({ user: userData }),
      setSession: (sessionData) => set({ session: sessionData }),
      clearUser: () => {
        console.log('clearUser called');
        
        set({ user: null, session: null })},
    }),
    {
      name: 'user-storage', // Unique name for storage
      getStorage: () => localStorage, // Uses localStorage for persistence
    }
  )
);

export default useUserStore;
