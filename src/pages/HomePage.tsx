import React from "react";
import { SectionWrapper } from "../components/SectionWrapper";
import LogoutButton from "../components/LogoutButton";
import WeatherForecast from "../components/WeatherForecast";

export const HomePage = () => {
  return (
    <SectionWrapper>
      <WeatherForecast />
    </SectionWrapper>
  );
};
