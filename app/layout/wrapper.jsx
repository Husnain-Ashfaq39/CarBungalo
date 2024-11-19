/* eslint-disable react/prop-types */
// Wrapper.jsx
'use client'
import React from 'react';
import useAuth from '@/utils/Hooks/useAuth'; // Adjust the path as needed

const Wrapper = ({ children }) => {
  const { user, session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    ); // Or a more sophisticated loading spinner
  }

  return (
    <div>
      {/* You can add layout elements here, such as headers or navigation bars */}
      {children}
    </div>
  );
};

export default Wrapper;
