import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { PageContainer as Container } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { EnvelopeSelector } from '../components/EnvelopeSelector';
import { useBudgetApi } from '../hooks/useBudgetApi';
import { CreatePlanRequest, Envelope, Budget, Plan } from '../services/types';

interface FormData {
  monthlyAmount: string;
  startDate: string;
  envelopeId: string;
}

export const AddPlanPage = () => {
  const navigate = useNavigate();
  const { envelopeId } = useParams<{ envelopeId?: string }>();
  const budgetApi = useBudgetApi();

  const [formData, setFormData] = useState<FormData>({
    monthlyAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    envelopeId: envelopeId || ''
  });

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [existingPlans, setExistingPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [envelopesLoading, setEnvelopesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load budget and envelopes on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setEnvelopesLoading(true);
        
        // First get the budget
        const budgetResponse = await budgetApi.getBudget();
        if (budgetResponse.data) {
          setBudget(budgetResponse.data);
          
          // Then get envelopes for that budget
          const envelopesResponse = await budgetApi.getEnvelopes(budgetResponse.data.id);
          if (envelopesResponse.data) {
            setEnvelopes(envelopesResponse.data);
          }

          // Get existing plans to calculate next priority
          const plansResponse = await budgetApi.getPlansByBudget(budgetResponse.data.id);
          if (plansResponse.data) {
            setExistingPlans(plansResponse.data);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setEnvelopesLoading(false);
      }
    };

    loadData();
  }, [budgetApi]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    const amount = parseFloat(formData.monthlyAmount);
    if (!formData.monthlyAmount || isNaN(amount) || amount <= 0) {
      return "Please enter a valid amount greater than 0";
    }
    
    if (!formData.startDate) {
      return "Please select a start date";
    }
    
    if (!formData.envelopeId) {
      return "Please select an envelope";
    }
    
    return null;
  };

  // Calculate the next priority (should be highest + 1 to put new plans at the bottom)
  const getNextPriority = (): number => {
    if (existingPlans.length === 0) {
      return 1; // First plan gets priority 1
    }
    
    // Find the highest priority and add 1
    const maxPriority = Math.max(...existingPlans.map(plan => plan.priority));
    return maxPriority + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!budget) {
      setError("Budget information not available");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const planRequest: CreatePlanRequest = {
        monthlyAmount: parseFloat(formData.monthlyAmount),
        startDate: formData.startDate,
        envelopeId: parseInt(formData.envelopeId),
        budgetId: budget.id,
        priority: getNextPriority() // Set priority to put new plan at the bottom
      };

      const response = await budgetApi.createPlan(planRequest);
      
      if (response.data) {
        setSuccess(true);
        // Reset form
        setFormData({
          monthlyAmount: '',
          startDate: new Date().toISOString().split('T')[0],
          envelopeId: envelopeId || ''
        });
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate("/budget/planner");
        }, 1000);
      }
    } catch (err) {
      console.error("Error creating plan:", err);
      if (err instanceof Error) {
        setError(`Failed to create plan: ${err.message}`);
      } else {
        setError("An error occurred while creating the plan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/budget/planner");
  };

  if (envelopesLoading) {
    return (
      <Container
        maxWidth="600px"
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Planner', path: '/budget/planner' },
          { label: 'Add Plan' }
        ]}
      >
        <LoadingMessage>Loading form...</LoadingMessage>
      </Container>
    );
  }

  if (success) {
    return (
      <Container
        maxWidth="600px"
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Planner', path: '/budget/planner' },
          { label: 'Add Plan' }
        ]}
      >
        <SuccessMessage>
          <strong>Success!</strong>
        </SuccessMessage>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="600px"
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Planner', path: '/budget/planner' },
        { label: 'Add Plan' }
      ]}
    >
      <PageTitle align="center">Create New Plan</PageTitle>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="monthlyAmount">Monthly Amount *</Label>
          <Input
            type="number"
            id="monthlyAmount"
            name="monthlyAmount"
            value={formData.monthlyAmount}
            onChange={handleInputChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            required
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="envelopeId">Envelope *</Label>
          <EnvelopeSelector
            id="envelopeId"
            name="envelopeId"
            envelopes={envelopes}
            value={formData.envelopeId}
            onChange={(value) => handleInputChange({ target: { name: 'envelopeId', value } } as any)}
            placeholder="Select an envelope"
            required
            disabled={loading}
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" disabled={loading || envelopesLoading}>
            {loading ? "Creating..." : "Create Plan"}
          </Button>
          <Button type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:invalid {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  background: hsl(0, 100%, 95%);
  color: ${({ theme }) => theme.colors.danger};
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid hsl(0, 100%, 90%);
`;

const SuccessMessage = styled.div`
  background: hsl(120, 100%, 95%);
  color: hsl(120, 50%, 30%);
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid hsl(120, 100%, 85%);
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
`;
