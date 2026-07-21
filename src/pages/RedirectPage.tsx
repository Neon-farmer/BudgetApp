import React, { useEffect, useState } from "react";
import { useRedirectHandler } from "../hooks/useRedirectHandler";
import { Loading } from "../components/Loading";
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
      <Loading message={message} />
    </RedirectContainer>
  );
};

const RedirectContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
`;

export default RedirectPage;
