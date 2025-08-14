import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import OrbitalSpinner from './OrbitalSpinner';

interface LoadingProps {
  message?: string;
  showSpinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'orbital';
}

// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
  min-height: 200px;
`;

const LoadingMessage = styled.p<{ size: string }>`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm': return '14px';
      case 'lg': return '18px';
      default: return '16px';
    }
  }};
  margin: 0;
  margin-top: ${({ size }) => size === 'sm' ? '8px' : '16px'};
`;

const Spinner = styled.div<{ size: string }>`
  border: 3px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: ${({ size }) => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'sm': return '24px';
      case 'lg': return '48px';
      default: return '32px';
    }
  }};
  animation: ${spin} 1s linear infinite;
`;

export const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  showSpinner = true,
  size = 'md',
  variant
}) => {
  const theme = useTheme();
  
  // Use the theme's loading preference if no variant is specified
  const currentVariant = variant || (theme as any).custom?.loading || 'default';

  if (currentVariant === 'orbital') {
    return <OrbitalSpinner size={size} message={message} />;
  }

  return (
    <LoadingContainer>
      {showSpinner && <Spinner size={size} />}
      <LoadingMessage size={size}>{message}</LoadingMessage>
    </LoadingContainer>
  );
};

// Alternative minimal loading component for inline use
export const LoadingText = styled.span`
  color: #666;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-style: italic;
`;

// Loading overlay for full-page loading states
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
