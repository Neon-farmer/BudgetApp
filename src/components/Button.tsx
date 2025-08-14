import React, { useState } from "react";
import styled from "styled-components";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  tooltip?: string; // Tooltip text to show when disabled
}

const ButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledButton = styled.button<{ $color: string }>`
  background-color: ${({ theme, $color }) => {
    switch ($color) {
      case 'danger': return theme.colors.danger;
      case 'secondary': return theme.colors.secondary;
      default: return theme.colors.primary;
    }
  }};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.colors.gray?.[800] || '#1f2937'};
  color: white;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.body};
  border-radius: 4px;
  white-space: nowrap;
  max-width: 300px;
  white-space: normal;
  text-align: center;
  line-height: 1.4;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  visibility: ${({ $visible }) => $visible ? 'visible' : 'hidden'};
  transition: opacity 0.2s ease, visibility 0.2s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  /* Tooltip arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.gray?.[800] || '#1f2937'};
  }

  /* Make sure tooltip doesn't get too wide */
  @media (max-width: 480px) {
    max-width: 250px;
    font-size: 11px;
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  color = 'primary', 
  disabled = false,
  type = 'button',
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    if (disabled && tooltip) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <ButtonContainer>
      <StyledButton 
        $color={color}
        onClick={onClick} 
        disabled={disabled}
        type={type}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </StyledButton>
      {disabled && tooltip && (
        <Tooltip $visible={showTooltip}>
          {tooltip}
        </Tooltip>
      )}
    </ButtonContainer>
  );
};
