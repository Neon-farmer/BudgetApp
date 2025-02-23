import React from "react";
import { SectionWrapper } from "../components/SectionWrapper";
import LogoutButton from "../components/LogoutButton";
import WeatherForecast from "../components/WeatherForecast";
import { Nav } from "../components/Nav";

export const HomePage = () => {
  return (
    <>
      <SectionWrapper></SectionWrapper>
      <Nav />
    </>
  );
};
