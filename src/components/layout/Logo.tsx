import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export interface LogoProps {
  text?: string;
  onClick?: () => void;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  text = 'Budget App', 
  onClick,
  className 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/budget/home');
    }
  };

  return (
    <LogoContainer onClick={handleClick} className={className}>
      <LogoText>{text}</LogoText>
    </LogoContainer>
  );
};

// Styled Components
const LogoContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

export default Logo;
