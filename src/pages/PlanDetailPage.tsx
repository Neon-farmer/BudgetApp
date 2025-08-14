import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBudgetApi } from '../hooks/useBudgetApi';
import { Plan, Envelope } from '../services/types';
import { ApiError } from '../services/apiService';
import { PageContainer as Container } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import styled from 'styled-components';

export const PlanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid plan ID");
      setLoading(false);
      return;
    }

    fetchPlanData(Number(id));
  }, [id]);

  const fetchPlanData = async (planId: number) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch plan details
      const planResponse = await budgetApi.getPlan(planId);
      const planData = planResponse.data;
      setPlan(planData);

      // Fetch envelope details
      if (planData.envelopeId) {
        const envelopeResponse = await budgetApi.getEnvelope(planData.envelopeId);
        setEnvelope(envelopeResponse.data);
      }
    } catch (err) {
      console.error("Failed to fetch plan data:", err);
      if (err instanceof ApiError) {
        setError(`Failed to load plan: ${err.message}`);
      } else {
        setError("Failed to load plan");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditPlan = () => {
    navigate(`/budget/planner/${id}/edit`);
  };

  const handleDeletePlan = async () => {
    if (!plan || deleting) return;
    
    const envelopeName = envelope?.name || `Envelope #${plan.envelopeId}`;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the plan for "${envelopeName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await budgetApi.deletePlan(plan.id);
      navigate('/budget/planner', { 
        replace: true,
        state: { message: `Plan for "${envelopeName}" has been deleted successfully.` }
      });
    } catch (err) {
      console.error("Failed to delete plan:", err);
      if (err instanceof ApiError) {
        setError(`Failed to delete plan: ${err.message}`);
      } else {
        setError("Failed to delete plan");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleBackToEnvelope = () => {
    if (envelope) {
      navigate(`/budget/envelope/${envelope.id}`);
    } else {
      navigate('/budget/envelopes');
    }
  };

  if (loading) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Planner', path: '/budget/planner' },
        { label: 'Loading...' }
      ]}>
        <Loading message="Loading plan details..." size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Planner', path: '/budget/planner' },
        { label: 'Error' }
      ]}>
        <PageTitle align="center">Error</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/planner')}>
            Back to Planner
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Planner', path: '/budget/planner' },
        { label: 'Not Found' }
      ]}>
        <PageTitle align="center">Plan Not Found</PageTitle>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/planner')}>
            Back to Planner
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <Container breadcrumbs={[
      { label: 'Home', path: '/budget/home' },
      { label: 'Planner', path: '/budget/planner' },
      { label: envelope?.name || `Envelope #${plan.envelopeId}` }
    ]}>
      <PageTitle align="center">{envelope?.name || `Envelope #${plan.envelopeId}`} Plan</PageTitle>
      
      <DetailCard>
        <DetailSection>
          <DetailLabel>Monthly Amount</DetailLabel>
          <DetailValue $isPositive={plan.monthlyAmount >= 0}>
            {formatCurrency(plan.monthlyAmount)}
          </DetailValue>
        </DetailSection>

        <DetailRow>
          <DetailLabel>Start Date</DetailLabel>
          <DetailText>{formatDate(plan.startDate)}</DetailText>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Envelope</DetailLabel>
          <EnvelopeLink onClick={handleBackToEnvelope}>
            {envelope ? envelope.name : 'Loading...'}
          </EnvelopeLink>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Priority</DetailLabel>
          <DetailText>{plan.priority}</DetailText>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Plan Balance</DetailLabel>
          <DetailValue2 $isPositive={plan.planBalance >= 0}>
            {formatCurrency(plan.planBalance)}
          </DetailValue2>
        </DetailRow>
      </DetailCard>

      <ActionButtons>
        <Button onClick={handleEditPlan}>
          Edit Plan
        </Button>
        <Button onClick={handleBackToEnvelope}>
          View Envelope
        </Button>
        <Button onClick={() => navigate('/budget/planner')}>
          Back to Planner
        </Button>
      </ActionButtons>
    </Container>
  );
};

// Styled Components
const DetailCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const DetailValue = styled.div<{ $isPositive: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $isPositive, theme }) => $isPositive ? theme.colors.success : theme.colors.danger};
  line-height: 1;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const DetailValue2 = styled.div<{ $isPositive: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isPositive, theme }) => $isPositive ? theme.colors.success : theme.colors.danger};
  line-height: 1;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const DetailText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EnvelopeLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  flex-wrap: wrap;
`;

const DeleteButton = styled(Button)`
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.danger};
    opacity: 0.9;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: ${({ theme }) => theme.colors.danger};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid #fecaca;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;
