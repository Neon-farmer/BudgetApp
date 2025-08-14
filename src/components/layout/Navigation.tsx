import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <NavigationContainer className={className}>
      <NavigationList>
        {items.map((item, index) => (
          <NavigationItem key={index}>
            <NavigationLink
              $isActive={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon && <NavigationIcon>{item.icon}</NavigationIcon>}
              <NavigationLabel>{item.label}</NavigationLabel>
            </NavigationLink>
          </NavigationItem>
        ))}
      </NavigationList>
    </NavigationContainer>
  );
};

// Styled Components
const NavigationContainer = styled.nav`
  display: flex;
  align-items: center;
`;

const NavigationList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const NavigationItem = styled.li`
  display: flex;
`;

const NavigationLink = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 1rem;
    gap: 8px;
    background: ${({ $isActive, theme }) => 
      $isActive ? theme.colors.primary : 'transparent'};
    color: ${({ $isActive, theme }) => 
      $isActive ? 'white' : theme.colors.text.primary};
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray?.[100] || '#f3f4f6'};
    
    @media (min-width: 768px) {
      background: ${({ $isActive, theme }) => 
        $isActive ? theme.colors.primary : (theme.colors.gray?.[100] || '#f3f4f6')};
    }
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const NavigationIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const NavigationLabel = styled.span`
  display: none;
  
  @media (min-width: 480px) {
    display: block;
  }
`;

export default Navigation;
