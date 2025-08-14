import React from 'react';
import styled from 'styled-components';

export interface MainProps {
  children: React.ReactNode;
  hasSidebar?: boolean;
  sidebarOpen?: boolean;
  className?: string;
}

export const Main: React.FC<MainProps> = ({ 
  children, 
  hasSidebar = false,
  sidebarOpen = false,
  className 
}) => {
  return (
    <MainContainer 
      $hasSidebar={hasSidebar}
      $sidebarOpen={sidebarOpen}
      className={className}
    >
      {children}
    </MainContainer>
  );
};

// Styled Components
const MainContainer = styled.main<{ 
  $hasSidebar: boolean;
  $sidebarOpen: boolean;
}>`
  padding-top: 64px;
  flex: 1;
  min-height: 0;
  background: ${({ theme }) => theme.colors.background || '#f8f9fa'};
  
  @media (min-width: 768px) {
    padding-top: 72px;
    margin-left: ${({ $hasSidebar, $sidebarOpen }) => 
      $hasSidebar && $sidebarOpen ? '280px' : '0'};
    transition: margin-left 0.3s ease;
  }
`;

export default Main;
