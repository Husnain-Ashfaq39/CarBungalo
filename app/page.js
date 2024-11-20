
'use client'
import Home_7 from "./(home)/home-7/page";
import Wrapper from "./layout/wrapper";
import React from "react";
import './global.css'
import useAuth from '@/utils/Hooks/useAuth'; // Adjust the path as needed


export default function MainRoot() {
  const {  loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    ); // Or a more sophisticated loading spinner
  }
  return (
    <Wrapper>
      <Home_7 />
    </Wrapper>
  );
}
