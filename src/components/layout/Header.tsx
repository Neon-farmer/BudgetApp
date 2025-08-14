import React from 'react';
import styled from 'styled-components';
import { Logo } from './Logo';
import { Navigation, NavigationItem } from './Navigation';

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  navigationItems?: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({ 
  children, 
  className,
  onMenuClick,
  showMenuButton = true,
  navigationItems = []
}) => {
  const defaultNavigationItems: NavigationItem[] = [
    { label: 'Home', path: '/budget/home' },
    { label: 'Envelopes', path: '/budget/envelopes' },
    { label: 'Transactions', path: '/budget/transactions' },
    { label: 'Planner', path: '/budget/planner' },
  ];

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems;

  return (
    <HeaderContainer className={className}>
      <HeaderContent>
        {showMenuButton && (
          <MenuButton onClick={onMenuClick}>
            <MenuIcon>
              <span></span>
              <span></span>
              <span></span>
            </MenuIcon>
          </MenuButton>
        )}
        
        <Logo />
        <Navigation items={navItems} />
        
        {children}
      </HeaderContent>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: ${({ theme }) => theme.colors.surface || '#ffffff'};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1200;
  
  @media (min-width: 768px) {
    height: 72px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background || '#f8f9fa'};
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18px;
  height: 14px;
  
  span {
    display: block;
    height: 2px;
    width: 100%;
    background: ${({ theme }) => theme.colors.text?.primary || '#111827'};
    border-radius: 1px;
    transition: all 0.2s ease;
  }
`;

export default Header;
