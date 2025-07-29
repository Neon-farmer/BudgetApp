import React from "react";
import { SectionWrapper } from "../components/SectionWrapper";
import LogoutButton from "../components/LogoutButton";
import WeatherForecast from "../components/WeatherForecast";
import { Nav } from "../components/Nav";
import { ApiCall } from "../components/ApiCall";
import { Api } from "styled-icons/material";

export const HomePage = () => {
  return (
    <>
      <SectionWrapper>
        <ApiCall/>
        </SectionWrapper>
    </>
  );
};
