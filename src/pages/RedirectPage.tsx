import React, { useEffect, useState } from "react";
import { useRedirectHandler } from "../hooks/useRedirectHandler";
import styled from "styled-components";

const RedirectPage = () => {
  const [message, setMessage] = useState("Processing authentication...");
  
  useRedirectHandler();

  useEffect(() => {
    // Check if there's an error in the URL
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const error = urlParams.get('error');
    
    if (error === 'access_denied') {
      setMessage("Authentication cancelled. Redirecting to login...");
    } else if (error) {
      setMessage("Authentication error. Redirecting to login...");
    }
  }, []);

  return (
    <RedirectContainer>
      <RedirectCard>
        <Spinner />
        <Message>{message}</Message>
      </RedirectCard>
    </RedirectContainer>
  );
};

const RedirectContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${props => props.theme.spacing.md};
`;

const RedirectCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 420px;

  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.xl};
    max-width: 100%;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  color: #2d3748;
  font-size: 1.1rem;
  margin: 0;
`;

export default RedirectPage;
