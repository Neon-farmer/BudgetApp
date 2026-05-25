import React from 'react';
import styled from 'styled-components';
import { PageContainer as Container, commonBreadcrumbs } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { ActionCard, ActionGrid } from '../components/ActionCard';

export const HelpPage: React.FC = () => {
  return (
    <Container maxWidth="900px" breadcrumbs={commonBreadcrumbs.home}>
      <PageTitle align="center">Help & How to use the App</PageTitle>

      <SectionTitle>Envelopes</SectionTitle>
      <Paragraph>
        Envelopes are categories that hold money for specific purposes (rent, groceries, savings, etc.).
        The Envelopes page lists all envelopes and their current balances. Click an envelope to view recent transactions
        or to edit envelope details. Use the + Add Envelope button to create a new envelope.
      </Paragraph>

      <SectionTitle>Transactions</SectionTitle>
      <Paragraph>
        Record expenses and income on the Transactions page. When you add an expense, select which envelope it
        should deduct from. Income can be allocated to envelopes manually or via the Planner.
      </Paragraph>

      <SectionTitle>Planner</SectionTitle>
      <Paragraph>
        The Planner helps you schedule recurring amounts and prepare monthly allocations. Use the Planner to create
        plans and apply them on the first of the month or when you run the planner manually.
      </Paragraph>

      <SectionTitle>Settings</SectionTitle>
      <Paragraph>
        In Settings you can configure default envelopes, enable features like tithing, and choose app preferences such
        as theme. Make sure to save settings after changes.
      </Paragraph>

      <SectionTitle>Add App to Home Screen</SectionTitle>
      <Paragraph>
        You can install this app on your device for quick access from your home screen, just like a native app.
      </Paragraph>

      <SubSectionTitle>iOS (iPhone/iPad)</SubSectionTitle>
      <InstructionList>
        <InstructionItem>1. Open this page in Safari</InstructionItem>
        <InstructionItem>2. Tap the Share button (rectangle with arrow)</InstructionItem>
        <InstructionItem>3. Scroll down and tap "Add to Home Screen"</InstructionItem>
        <InstructionItem>4. Enter a name for the app (or keep the default)</InstructionItem>
        <InstructionItem>5. Tap "Add" to confirm</InstructionItem>
        <InstructionItem>6. The app icon will appear on your home screen</InstructionItem>
      </InstructionList>

      <SubSectionTitle>Android</SubSectionTitle>
      <InstructionList>
        <InstructionItem>1. Open this page in Chrome (or your preferred browser)</InstructionItem>
        <InstructionItem>2. Tap the menu button (three dots) at the top right</InstructionItem>
        <InstructionItem>3. Tap "Add to Home screen" or "Install app"</InstructionItem>
        <InstructionItem>4. Enter a name for the app (or keep the default)</InstructionItem>
        <InstructionItem>5. Tap "Install" or "Add" to confirm</InstructionItem>
        <InstructionItem>6. The app icon will appear on your home screen</InstructionItem>
      </InstructionList>

      <Note>
        <strong>Tip:</strong> Once installed, you can launch the app directly from your home screen and it will open in a full-screen app-like experience without the browser's address bar.
      </Note>
    </Container>
  );
};

const Intro = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const SectionTitle = styled.h3`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
`;

const Paragraph = styled.p`
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const SubSectionTitle = styled.h4`
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem 0;
`;

const InstructionItem = styled.li`
  padding: 0.5rem 0;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  line-height: 1.4;
`;

const Note = styled.div`
  background: ${({ theme }) => theme.colors.gray?.[100] || '#f3f4f6'};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  margin-top: 1.5rem;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.95rem;
`;

export default HelpPage;
