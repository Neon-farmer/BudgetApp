import React from 'react';
import styled from 'styled-components';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/authConfig';
import { useLogin } from '../hooks/useLogin';

export const LoginPage: React.FC = () => {
  const { instance } = useMsal();
  const { handleLogin } = useLogin();

  const onLoginClick = () => {
    handleLogin();
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <AppTitle>Budget App</AppTitle>
          <AppSubtitle>Simple, intuitive financial management</AppSubtitle>
        </LogoSection>

        <LoginContent>
          {/* <SubText>Sign in to access your budget dashboard</SubText> */}

          <LoginButton onClick={onLoginClick}>
            <MicrosoftIcon>
              <svg width="20" height="20" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
            </MicrosoftIcon>
            <ButtonText>Sign in with Microsoft</ButtonText>
          </LoginButton>
        </LoginContent>

        <Footer>
          <FooterText>
            By signing in, you agree to our terms of service and privacy policy.
          </FooterText>
        </Footer>
      </LoginCard>

      <BackgroundPattern />
    </LoginContainer>
  );
};

// Styled Components
const LoginContainer = styled.div`
  // min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.md};
  position: relative;
  overflow: hidden;
  margin: auto;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, ${props => props.theme.colors.gray[100]} 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, ${props => props.theme.colors.gray[100]} 2px, transparent 2px);
  background-size: 60px 60px;
  pointer-events: none;
`;

const LoginCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.xxl};
  width: 100%;
  max-width: 420px;
  box-shadow: ${props => props.theme.shadows.md};
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xl};
    margin: ${props => props.theme.spacing.md};
  }
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xxl};
`;

const AppTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
  font-family: ${props => props.theme.fonts.heading};
`;

const AppSubtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
  font-family: ${props => props.theme.fonts.body};
`;

const LoginContent = styled.div`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SubText = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  text-align: center;
  margin: 0 0 ${props => props.theme.spacing.xl} 0;
  font-size: 1rem;
  font-family: ${props => props.theme.fonts.body};
`;

const LoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.info};
  color: ${props => props.theme.colors.text.inverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  box-shadow: ${props => props.theme.shadows.md};
  font-family: ${props => props.theme.fonts.body};

  &:hover {
    background: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.3);
  }
`;

const MicrosoftIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.span`
  font-family: ${props => props.theme.fonts.body};
`;

const Footer = styled.div`
  text-align: center;
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FooterText = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.muted};
  margin: 0;
  line-height: 1.4;
  font-family: ${props => props.theme.fonts.body};
`;