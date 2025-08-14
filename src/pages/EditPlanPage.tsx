import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { EnvelopeSelector } from '../components/EnvelopeSelector';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  FormContainer, 
  FormGroup, 
  Label, 
  Input, 
  FormActions,
  ErrorMessage as FormErrorMessage
} from '../components/Form';
import { PageContainer } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { useBudgetApi } from '../hooks/useBudgetApi';
import { Plan, Envelope, Budget } from '../services/types';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const SuccessMessage = styled.div`
  background: hsl(158, 64%, 95%);
  color: ${({ theme }) => theme.colors.success};
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid hsl(158, 64%, 90%);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
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

interface FormData {
  monthlyAmount: string;
  startDate: string;
  envelopeId: string;
}

export const EditPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const budgetApi = useBudgetApi();
  
  const [formData, setFormData] = useState<FormData>({
    monthlyAmount: '',
    startDate: '',
    envelopeId: ''
  });
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPlanAndEnvelopes();
    } else {
      setError("Plan ID is required");
      setLoading(false);
    }
  }, [id]);

  const loadPlanAndEnvelopes = async () => {
    if (!id) return;

    // Validate that id is a valid number
    const planId = parseInt(id);
    if (isNaN(planId)) {
      setError("Invalid plan ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load plan details
      const planResponse = await budgetApi.getPlan(planId);
      if (!planResponse.data) {
        throw new Error("Plan not found");
      }
      
      const planData = planResponse.data;
      setPlan(planData);

      // Set form data from plan
      setFormData({
        monthlyAmount: planData.monthlyAmount.toString(),
        startDate: planData.startDate.split('T')[0], // Convert to YYYY-MM-DD format
        envelopeId: planData.envelopeId.toString()
      });

      // Load budget and envelopes
      const budgetResponse = await budgetApi.getBudget();
      if (!budgetResponse.data) {
        throw new Error("Failed to load budget");
      }

      setBudget(budgetResponse.data);

      // Get envelopes using the dedicated endpoint
      const envelopesResponse = await budgetApi.getEnvelopes(budgetResponse.data.id);
      if (envelopesResponse.data) {
        setEnvelopes(envelopesResponse.data);
      } else {
        setEnvelopes([]);
      }

    } catch (err) {
      console.error("Error loading plan and envelopes:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while loading the plan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = (): string | null => {
    if (!formData.monthlyAmount || parseFloat(formData.monthlyAmount) <= 0) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!plan || !budget) {
      setError("Plan or budget information not available");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const updatedPlan: Plan = {
        ...plan,
        monthlyAmount: parseFloat(formData.monthlyAmount),
        startDate: formData.startDate,
        envelopeId: parseInt(formData.envelopeId)
      };

      console.log("Updating plan with data:", updatedPlan);

      const response = await budgetApi.updatePlan(plan.id, updatedPlan);
      
      if (response.data) {
        setSuccess("Plan updated successfully!");
        console.log("Plan updated:", response.data);
        
        // Navigate back to the plan detail page after a short delay
        setTimeout(() => {
          navigate(`/budget/planner/${plan.id}`);
        }, 1500);
      }

    } catch (err) {
      console.error("Error updating plan:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while updating the plan");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!plan || deleting) return;
    
    const selectedEnvelope = envelopes.find(env => env.id === plan.envelopeId);
    const envelopeName = selectedEnvelope?.name || `Envelope #${plan.envelopeId}`;
    
    setDeleting(true);
    try {
      await budgetApi.deletePlan(plan.id);
      navigate('/budget/planner', { 
        replace: true,
        state: { message: `Plan for "${envelopeName}" has been deleted successfully.` }
      });
    } catch (err) {
      console.error("Failed to delete plan:", err);
      if (err instanceof Error) {
        setError(`Failed to delete plan: ${err.message}`);
      } else {
        setError("Failed to delete plan");
      }
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleCancel = () => {
    if (plan) {
      navigate(`/budget/planner/${plan.id}`);
    } else {
      navigate('/budget/planner');
    }
  };

  if (loading) {
    return (
      <PageContainer 
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Plans', path: '/budget/planner' },
          { label: 'Loading...' }
        ]}
      >
        <LoadingMessage>Loading plan details...</LoadingMessage>
      </PageContainer>
    );
  }

  if (error && !plan) {
    return (
      <PageContainer 
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Plans', path: '/budget/planner' },
          { label: 'Edit Plan' }
        ]}
      >
        <PageTitle>Edit Plan</PageTitle>
        <Header>
          <Button onClick={() => navigate('/budget/planner')}>Back to Plans</Button>
        </Header>
        <FormErrorMessage>
          <strong>Error:</strong> {error}
        </FormErrorMessage>
      </PageContainer>
    );
  }

    const selectedEnvelope = envelopes.find(env => env.id === plan?.envelopeId);
    
    return (
    <PageContainer 
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Plans', path: '/budget/planner' },
        { label: selectedEnvelope ? `Edit ${selectedEnvelope.name} Plan` : 'Edit Plan' }
      ]}
    >
      <PageTitle align='center'>Edit Plan{selectedEnvelope ? `: ${selectedEnvelope.name}` : ''}</PageTitle>        <FormContainer onSubmit={handleSubmit}>
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
            />
          </FormGroup>

          {error && (
            <FormErrorMessage>
              <strong>Error:</strong> {error}
            </FormErrorMessage>
          )}

          {success && (
            <SuccessMessage>
              <strong>Success:</strong> {success}
            </SuccessMessage>
          )}

          <FormActions>
            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || deleting}
              color="primary"
            >
              {submitting ? 'Updating...' : 'Update Plan'}
            </Button>
            <DeleteButton 
              type="button"
              onClick={handleDeleteClick}
              disabled={deleting || submitting}
            >
              {deleting ? 'Deleting...' : 'Delete Plan'}
            </DeleteButton>
          </FormActions>
        </FormContainer>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeletePlan}
          title="Delete Plan"
          message={`Are you sure you want to delete the plan for "${envelopes.find(env => env.id === plan?.envelopeId)?.name || `Envelope #${plan?.envelopeId}`}"? This action cannot be undone and will permanently remove all plan data.`}
          confirmText="Delete Plan"
          cancelText="Cancel"
          isLoading={deleting}
          variant="danger"
        />
    </PageContainer>
  );
};
