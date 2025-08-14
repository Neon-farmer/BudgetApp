import React from "react";
import { MaterialIcon } from "./MaterialIcon";

interface NavIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const NavIcon: React.FC<NavIconProps> = ({ name, size = 24, color = "white" }) => {
  return <MaterialIcon name={name} size={size} color={color} />;
};
