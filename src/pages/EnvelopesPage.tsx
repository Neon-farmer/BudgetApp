import { useState, useEffect } from 'react';
import { useBudgetApi } from '../hooks/useBudgetApi';
import { useGlobalLoading } from '../hooks/useGlobalLoading';
import { Envelope } from '../services/types';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../services/apiService';
import { Table, Column, AutoCurrencyCell } from '../components/tables/Table';
import { PageContainer as Container, commonBreadcrumbs } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import styled from 'styled-components';

export const EnvelopesPage = () => {
  const budgetApi = useBudgetApi();
  const navigate = useNavigate();
  const { isLoading: globalLoading, showLoading, hideLoading } = useGlobalLoading();
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetId, setBudgetId] = useState<number | null>(null);

  // Define table columns
  const columns: Column<Envelope>[] = [
    {
      key: 'name',
      header: 'Envelope Name',
      width: '60%',
      render: (value) => <EnvelopeName>{value}</EnvelopeName>
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'left',
      width: '40%',
      render: (value) => (
        <AutoCurrencyCell value={value} />
      )
    }
  ];

  // First, get the budget ID
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await budgetApi.getBudget();
        setBudgetId(response.data.id);
      } catch (err) {
        console.error('Failed to fetch budget:', err);
        if (err instanceof ApiError) {
          setError(`Failed to load budget: ${err.message}`);
        } else {
          setError('Failed to load budget');
        }
      }
    };

    fetchBudget();
  }, []); // No dependencies needed with new service architecture

  // Then fetch envelopes when we have the budget ID
  useEffect(() => {
    if (!budgetId) return;

    const fetchEnvelopes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching envelopes for budget ID: ${budgetId}`);
        const response = await budgetApi.getEnvelopes(budgetId);
        console.log('Envelopes response:', response);
        setEnvelopes(response.data || []);
      } catch (err) {
        console.error('Failed to fetch envelopes:', err);
        
        // Handle 404 specifically - means no envelopes found, which is valid
        if (err instanceof ApiError && err.status === 404) {
          console.log('No envelopes found (404), setting empty array');
          setEnvelopes([]);
        } else if (err instanceof ApiError) {
          setError(`Failed to load envelopes: ${err.message}`);
        } else {
          setError('Failed to load envelopes');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEnvelopes();
  }, [budgetId]); // Depend on budgetId, not function

  const handleRefresh = () => {
    if (budgetId) {
      // Trigger re-fetch by clearing and re-setting budget ID
      const currentBudgetId = budgetId;
      setBudgetId(null);
      setTimeout(() => setBudgetId(currentBudgetId), 0);
    }
  };

  const handleEnvelopeClick = (envelopeId: number) => {
    navigate(`/budget/envelope/${envelopeId}`);
  };

  const handleAddEnvelope = () => {
    navigate('/budget/envelope/new');
  };

  const handleGlobalLoadingDemo = () => {
    // Demonstrate global loading state
    showLoading('Refreshing all data...');
    
    // Simulate a longer operation
    setTimeout(() => {
      hideLoading();
      handleRefresh();
    }, 2000);
  };

  if (loading) {
    return (
      <Container breadcrumbs={commonBreadcrumbs.envelopes}>
        <Loading message="Loading envelopes..." size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container breadcrumbs={commonBreadcrumbs.envelopes}>
        <PageTitle align="center">Envelopes</PageTitle>
        <ErrorMessage>
          Error: {error}
        </ErrorMessage>
        <ButtonGroup>
          <RefreshButton onClick={handleRefresh}>
            Retry
          </RefreshButton>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <Container breadcrumbs={commonBreadcrumbs.envelopes}>
      <PageTitle align="center">Envelopes</PageTitle>
      
      <ButtonGroup>
        <Button onClick={handleAddEnvelope}>
          Add Envelope
        </Button>
      </ButtonGroup>

      {envelopes.length === 0 && !loading ? (
        <EmptyMessage>No envelopes found for this budget.</EmptyMessage>
      ) : (
        <Table
          columns={columns}
          data={envelopes}
          loading={loading}
          rowKey="id"
          onRowClick={(envelope) => handleEnvelopeClick(envelope.id)}
          empty={<EmptyMessage>No envelopes found for this budget.</EmptyMessage>}
          hoverable
        />
      )}
    </Container>
  );
};

// Styled Components
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DemoButton = styled.button`
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a6268;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 20px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EnvelopeName = styled.strong`
  color: #333;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  font-family: ${({ theme }) => theme.fonts.body};
`;
