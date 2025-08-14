import React, { useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { Loading, LoadingText, LoadingOverlay } from "../components/Loading";
import { Button } from "../components/Button";
import styled from "styled-components";

const DemoSection = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const DemoBox = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
`;

export const LoadingDemoPage = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleShowOverlay = () => {
    setShowOverlay(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowOverlay(false), 3000);
  };

  return (
    <PageContainer
      maxWidth="1000px"
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Loading Demo' }
      ]}
    >
      <PageTitle title="Loading Component Demo" />
      
      <DemoSection>
        <SectionTitle>Standard Loading Components</SectionTitle>
        <DemoGrid>
          <DemoBox>
            <h3>Small Loading</h3>
            <Loading message="Loading data..." size="sm" />
          </DemoBox>
          
          <DemoBox>
            <h3>Medium Loading (Default)</h3>
            <Loading message="Loading content..." />
          </DemoBox>
          
          <DemoBox>
            <h3>Large Loading</h3>
            <Loading message="Loading page..." size="lg" />
          </DemoBox>
        </DemoGrid>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Orbital Loading Spinners</SectionTitle>
        <DemoGrid>
          <DemoBox>
            <h3>Small Orbital</h3>
            <Loading message="Loading data..." size="sm" variant="orbital" />
          </DemoBox>
          
          <DemoBox>
            <h3>Medium Orbital</h3>
            <Loading message="Loading content..." size="md" variant="orbital" />
          </DemoBox>
          
          <DemoBox>
            <h3>Large Orbital</h3>
            <Loading message="Loading page..." size="lg" variant="orbital" />
          </DemoBox>
        </DemoGrid>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Loading Without Spinner</SectionTitle>
        <DemoBox>
          <Loading message="Processing request..." showSpinner={false} />
        </DemoBox>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Inline Loading Text</SectionTitle>
        <DemoBox>
          <p>Data is <LoadingText>Loading...</LoadingText> please wait.</p>
          <p>Status: <LoadingText>Fetching results...</LoadingText></p>
        </DemoBox>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Loading Overlay</SectionTitle>
        <DemoBox>
          <p>Click the button below to show a full-screen loading overlay for 3 seconds:</p>
          <Button onClick={handleShowOverlay}>Show Loading Overlay</Button>
        </DemoBox>
      </DemoSection>

      <DemoSection>
        <SectionTitle>Custom Messages</SectionTitle>
        <DemoGrid>
          <DemoBox>
            <Loading message="Saving your changes..." size="md" />
          </DemoBox>
          
          <DemoBox>
            <Loading message="Uploading file..." size="md" />
          </DemoBox>
          
          <DemoBox>
            <Loading message="Connecting to server..." size="md" />
          </DemoBox>
        </DemoGrid>
      </DemoSection>

      {/* Loading Overlay */}
      {showOverlay && (
        <LoadingOverlay>
          <Loading message="Processing your request..." size="lg" variant="orbital" />
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};
