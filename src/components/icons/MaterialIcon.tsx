import React from "react";
import styled from "styled-components";

interface MaterialIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  name, 
  size = 24, 
  color = 'inherit',
  className = '' 
}) => {
  return (
    <IconWrapper 
      className={`material-icons ${className}`}
      $size={size}
      $color={color}
    >
      {name}
    </IconWrapper>
  );
};

const IconWrapper = styled.span<{ $size: number; $color: string }>`
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: ${({ $size }) => $size}px;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  user-select: none;
`;
