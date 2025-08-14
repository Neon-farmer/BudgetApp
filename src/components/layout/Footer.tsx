import React from 'react';
import styled from 'styled-components';

export interface FooterProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export const Footer: React.FC<FooterProps> = ({ 
  className,
  variant = 'default'
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer $variant={variant} className={className}>
      {variant === 'default' ? (
        <FooterContent>
          <FooterSection>
            <FooterTitle>Budget App</FooterTitle>
            <FooterDescription>
              Manage your finances with ease
            </FooterDescription>
          </FooterSection>
          
          <FooterSection>
            <FooterSubtitle>Quick Links</FooterSubtitle>
            <FooterLinkList>
              <FooterLink href="/envelopes">Envelopes</FooterLink>
              <FooterLink href="/transactions">Transactions</FooterLink>
              <FooterLink href="/planner">Planner</FooterLink>
            </FooterLinkList>
          </FooterSection>
          
          <FooterSection>
            <FooterSubtitle>Support</FooterSubtitle>
            <FooterLinkList>
              <FooterLink href="/help">Help</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/about">About</FooterLink>
            </FooterLinkList>
          </FooterSection>
        </FooterContent>
      ) : null}
      
      <FooterBottom>
        <FooterCopyright>
          © {currentYear} Budget App. All rights reserved.
        </FooterCopyright>
      </FooterBottom>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer<{ $variant: 'default' | 'minimal' }>`
  background: ${({ theme }) => theme.colors.surface || '#ffffff'};
  border-top: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
  margin-top: auto;
  
  ${({ $variant }) => $variant === 'minimal' && `
    padding: 1rem 0;
  `}
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 3rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.primary || '#111827'};
  margin: 0;
`;

const FooterSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text?.primary || '#111827'};
  margin: 0;
`;

const FooterDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text?.secondary || '#6b7280'};
  margin: 0;
  line-height: 1.5;
`;

const FooterLinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text?.secondary || '#6b7280'};
  text-decoration: none;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
  }
`;

const FooterBottom = styled.div`
  background: ${({ theme }) => theme.colors.background || '#f8f9fa'};
  border-top: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
  padding: 1rem;
`;

const FooterCopyright = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text?.secondary || '#6b7280'};
  margin: 0;
  max-width: 1200px;
  margin: 0 auto;
`;

export default Footer;
