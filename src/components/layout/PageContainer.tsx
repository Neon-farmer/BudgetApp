import React from 'react';
import styled from 'styled-components';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

export interface PageContainerProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  maxWidth?: string;
  padding?: string;
  background?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  breadcrumbs,
  className,
  maxWidth = '1200px',
  padding,
  background
}) => {
  return (
    <Container 
      className={className} 
      $maxWidth={maxWidth} 
      $padding={padding}
      $background={background}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}
      {children}
    </Container>
  );
};

// Styled Components
const Container = styled.div<{
  $maxWidth: string;
  $padding?: string;
  $background?: string;
}>`
  padding: ${({ $padding }) => $padding || '20px'};
  max-width: ${({ $maxWidth }) => $maxWidth};
  margin: 0 auto;
  box-sizing: border-box;
  background: ${({ $background, theme }) => $background || theme.colors.background || 'transparent'};
  
  @media (max-width: 768px) {
    padding: ${({ $padding }) => $padding || '16px'};
  }
`;

export default PageContainer;

// Common breadcrumb patterns
export const commonBreadcrumbs = {
  home: [{ label: 'Home' }],
  homeWithBack: (backPath: string, backLabel: string = 'Home') => [
    { label: backLabel, path: backPath }
  ],
  budget: [
    { label: 'Home', path: '/budget/home' },
    { label: 'Budget' }
  ],
  envelopes: [
    { label: 'Home', path: '/budget/home' },
    { label: 'Envelopes', path: '/budget/envelopes' },
  ],
  addIncome: [
    { label: 'Home', path: '/budget/home' },
    { label: 'Add Income', path: '/budget/income/add' }
  ],
  planner: [
    { label: 'Home', path: '/budget/home' },
    { label: 'Planner', path: '/budget/planner' }
  ],
  styleGuide: [
    { label: 'Home', path: '/budget/home' },
    { label: 'Style Guide', path: '/budget/style-guide' }
  ]
};
