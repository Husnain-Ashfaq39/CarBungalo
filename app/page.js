
import Home_7 from "./(home)/home-7/page";
import Wrapper from "./layout/wrapper";
import React from "react";
import './global.css'
export const metadata = {
  title: "Car Bungalo",
  description: `Car Customization Platform `,
};

export default function MainRoot() {
  return (
    <Wrapper>
      <Home_7 />
    </Wrapper>
  );
}
