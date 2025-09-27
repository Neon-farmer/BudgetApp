import React from 'react';
import styled from 'styled-components';
import { UserVerificationStatus, useUserVerification } from '../hooks/useUserVerification';
import { Loading } from './Loading';
import { Button } from './Button';
import { useLogout } from '../hooks/useLogout';

interface UserVerificationWrapperProps {
  children: React.ReactNode;
}

export const UserVerificationWrapper: React.FC<UserVerificationWrapperProps> = ({ children }) => {
  const { status, user, error, isLoading, isVerified, retry } = useUserVerification();
  const { handleLogout } = useLogout();

  if (isLoading) {
    return (
      <VerificationContainer>
        <VerificationCard>
          <Loading message="Verifying user access..." size="lg" />
        </VerificationCard>
      </VerificationContainer>
    );
  }

  if (isVerified) {
    return <>{children}</>;
  }

  // Handle error states
  return (
    <VerificationContainer>
      <VerificationCard>
        <ErrorIcon>!</ErrorIcon>
        <ErrorTitle>Access Verification Required</ErrorTitle>
        
        {status === UserVerificationStatus.INACTIVE && (
          <>
            <ErrorMessage>
              Your account has been deactivated. Please contact support to reactivate your account.
            </ErrorMessage>
            <ErrorDetails>
              Account: {user?.email}
            </ErrorDetails>
          </>
        )}
        
        {status === UserVerificationStatus.ERROR && (
          <>
            <ErrorMessage>
              Unable to verify your access. Please try again or contact support if the problem persists.
            </ErrorMessage>
            <ErrorDetails>
              {error}
            </ErrorDetails>
          </>
        )}

        <ButtonGroup>
          <Button onClick={retry} color="primary">
            Try Again
          </Button>
          <Button onClick={handleLogout} color="secondary">
            Sign Out
          </Button>
        </ButtonGroup>
        
        <SupportInfo>
          <SupportTitle>Need Help?</SupportTitle>
          <SupportText>
            Contact your administrator or IT support for assistance with account access.
          </SupportText>
        </SupportInfo>
      </VerificationCard>
    </VerificationContainer>
  );
};

// Styled Components
const VerificationContainer = styled.div`
//   min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
`;

const VerificationCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xxl};
  width: 100%;
  max-width: 500px;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.md};
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ErrorTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-family: ${props => props.theme.fonts.heading};
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  line-height: 1.5;
  font-family: ${props => props.theme.fonts.body};
`;

const ErrorDetails = styled.p`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  margin: 0 0 ${props => props.theme.spacing.xl} 0;
  font-family: ${props => props.theme.fonts.body};
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.xl};
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const SupportInfo = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.lg};
`;

const SupportTitle = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-family: ${props => props.theme.fonts.heading};
`;

const SupportText = styled.p`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
  font-family: ${props => props.theme.fonts.body};
`;
