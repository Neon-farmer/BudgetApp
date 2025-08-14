import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  className
}) => {
  const navigate = useNavigate();

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    // Don't navigate if it's the last item (current page)
    if (index === items.length - 1) return;

    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <BreadcrumbContainer className={className}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItemWrapper key={index}>
            <BreadcrumbLink
              $isActive={index === items.length - 1}
              $isClickable={!!(item.path || item.onClick) && index !== items.length - 1}
              onClick={() => handleItemClick(item, index)}
            >
              {item.label}
            </BreadcrumbLink>
            {index < items.length - 1 && (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            )}
          </BreadcrumbItemWrapper>
        ))}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

// Styled Components
const BreadcrumbContainer = styled.nav`
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

const BreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4px;
  
  @media (min-width: 768px) {
    gap: 8px;
  }
`;

const BreadcrumbItemWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: 4px;
  
  @media (min-width: 768px) {
    gap: 8px;
  }
`;

const BreadcrumbLink = styled.button<{
  $isActive: boolean;
  $isClickable: boolean;
}>`
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  cursor: ${({ $isClickable }) => $isClickable ? 'pointer' : 'default'};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    padding: 6px 12px;
    font-size: 1rem;
  }
  
  ${({ $isClickable, theme }) => $isClickable && `
    &:hover {
      background: ${theme.colors.gray?.[100] || '#f3f4f6'};
      color: ${theme.colors.primary};
    }
    
    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }
  `}
  
  ${({ $isActive }) => $isActive && `
    cursor: default;
    pointer-events: none;
  `}
`;

const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.8rem;
  user-select: none;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

// Utility function to create breadcrumbs from current path
export const createBreadcrumbsFromPath = (
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(segment => segment !== '');
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = customLabels?.[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      path: index === segments.length - 1 ? undefined : currentPath
    });
  });
  
  return breadcrumbs;
};

export default Breadcrumb;
