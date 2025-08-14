import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { Loading } from "../components/Loading";
import { EnvelopeSelector } from "../components/EnvelopeSelector";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { CreateTransactionRequest, Envelope } from "../services/types";

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

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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

interface FormData {
  amount: string;
  envelopeId: string;
  notes: string;
  date: string;
}

export const AddExpensePage = () => {
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();
  
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    envelopeId: "",
    notes: "",
    date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  });
  
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnvelopes, setLoadingEnvelopes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load envelopes on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingEnvelopes(true);
        
        // First get the budget
        const budgetResponse = await budgetApi.getBudget();
        if (budgetResponse.data) {
          const budget = budgetResponse.data;
          setBudgetId(budget.id);
          
          // Then get envelopes for that budget
          const envelopesResponse = await budgetApi.getEnvelopes(budget.id);
          if (envelopesResponse.data) {
            setEnvelopes(envelopesResponse.data);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load envelopes. Please try again.");
      } finally {
        setLoadingEnvelopes(false);
      }
    };

    loadData();
  }, [budgetApi]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.envelopeId || !formData.date || !budgetId) {
      setError("Amount, envelope, and date are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create expense transaction with negative amount
      const transaction: CreateTransactionRequest = {
        Amount: -amount, // Negative amount for expense
        Notes: formData.notes || "",
        EnvelopeId: parseInt(formData.envelopeId),
        BudgetId: budgetId,
        Date: formData.date
      };

      const response = await budgetApi.createTransaction(transaction);
      
      if (response.data) {
        setSuccess(true);
        // Reset form
        setFormData({
          amount: "",
          envelopeId: "",
          notes: "",
          date: new Date().toISOString().split('T')[0]
        });
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate("/budget/home");
        }, 1000);
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      if (err instanceof Error) {
        setError(`Failed to create expense: ${err.message}`);
      } else {
        setError("An error occurred while creating the expense");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (loadingEnvelopes) {
    return (
      <Container
        maxWidth="600px"
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Add Expense' }
        ]}
      >
        <Loading message="Loading envelopes..." size="lg" />
      </Container>
    );
  }

  if (success) {
    return (
      <Container
        maxWidth="600px"
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Add Expense' }
        ]}
      >
        <SuccessMessage>
          <strong>Success!</strong> Expense has been recorded successfully. 
          You will be redirected to the home page in a moment.
        </SuccessMessage>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="600px"
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Add Expense' }
      ]}
    >
      <PageTitle align="center">Add Expense</PageTitle>
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="amount">Expense Amount *</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              placeholder="Enter expense amount"
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
              disabled={loadingEnvelopes}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date *</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="notes">Notes</Label>
            <TextArea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Optional notes about this expense..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading || loadingEnvelopes}>
              {loading ? "Adding Expense..." : "Add Expense"}
            </Button>
            <Button type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
    </Container>
  );
};
