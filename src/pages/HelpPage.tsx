import React from 'react';
import styled from 'styled-components';
import { PageContainer as Container, commonBreadcrumbs } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { ActionCard, ActionGrid } from '../components/ActionCard';

export const HelpPage: React.FC = () => {
  return (
    <Container maxWidth="900px" breadcrumbs={commonBreadcrumbs.home}>
      <PageTitle align="center">Help & How to use the App</PageTitle>

      <Intro>
        Welcome — this page walks through the main features of the budgeting app and how to get started.
        If you need more help, check the Troubleshooting section at the bottom.
      </Intro>

      <SectionTitle>Getting started</SectionTitle>
      <ActionGrid>
        <ActionCard
          title="Sign in"
          description="Use the Login button to sign in with your organization account. Once signed in, the app will verify your user and load your budget."
        />
        <ActionCard
          title="Home"
          description="The Home page gives quick actions for adding income, recording expenses, and viewing envelopes."
        />
      </ActionGrid>

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

      <SectionTitle>Troubleshooting & Tips</SectionTitle>
      <Paragraph>
        • If the app redirects unexpectedly, sign out and sign back in from the Login page.\n
        • If API calls fail with authentication errors, check that you signed in with the correct account and try
        a browser refresh.\n
        • No envelopes shown? Create one with the Add Envelope button — the backend will return an empty list
        when none exist.
      </Paragraph>

      <SectionTitle>Need more help?</SectionTitle>
      <Paragraph>
        If you still need assistance, open an issue in the project repository or contact the app administrator with
        details about the problem and screenshots where possible.
      </Paragraph>
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

export default HelpPage;
