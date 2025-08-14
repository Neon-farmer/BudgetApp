import React from 'react';
import styled from 'styled-components';
import { PageContainer } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import OrbitalSpinner from '../components/OrbitalSpinner';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px 0;
`;

const DemoSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 30px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SectionTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const SpinnerRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
`;

const SpinnerDemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const SizeLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 16px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow-x: auto;
  margin: 20px 0 0 0;
`;

export const OrbitalSpinnerDemo: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle title="Orbital Spinner Demo" />
      
      <DemoContainer>
        <DemoSection>
          <SectionTitle>Different Sizes</SectionTitle>
          <SpinnerRow>
            <SpinnerDemo>
              <OrbitalSpinner size="sm" message="Small" />
              <SizeLabel>Small (200px)</SizeLabel>
            </SpinnerDemo>
            <SpinnerDemo>
              <OrbitalSpinner size="md" message="Medium" />
              <SizeLabel>Medium (300px)</SizeLabel>
            </SpinnerDemo>
            <SpinnerDemo>
              <OrbitalSpinner size="lg" message="Large" />
              <SizeLabel>Large (400px)</SizeLabel>
            </SpinnerDemo>
          </SpinnerRow>
        </DemoSection>

        <DemoSection>
          <SectionTitle>Usage Examples</SectionTitle>
          
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: '500' }}>Basic Usage</h4>
            <OrbitalSpinner />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: '500' }}>Custom Message</h4>
            <OrbitalSpinner message="Processing your request..." />
          </div>

          <div>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '1rem', fontWeight: '500' }}>No Message</h4>
            <OrbitalSpinner message="" />
          </div>
        </DemoSection>

        <DemoSection>
          <SectionTitle>Code Examples</SectionTitle>
          
          <CodeBlock>
{`// Import the component
import OrbitalSpinner from '../components/OrbitalSpinner';

// Basic usage
<OrbitalSpinner />

// With custom size and message
<OrbitalSpinner size="lg" message="Loading your data..." />

// Small spinner without message
<OrbitalSpinner size="sm" message="" />`}
          </CodeBlock>
        </DemoSection>
      </DemoContainer>
    </PageContainer>
  );
};

export default OrbitalSpinnerDemo;
