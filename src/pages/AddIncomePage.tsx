import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { AllocateIncomeDto } from "../services/types";

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
  font-family: inherit;

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
  notes: string;
  date: string;
}

export const AddIncomePage = () => {
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();
  
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    notes: "",
    date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.date) {
      setError("Amount and date are required");
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

      const dto: AllocateIncomeDto = {
        Amount: amount,
        Notes: formData.notes || "",
        Date: formData.date
      };

      const response = await budgetApi.allocateIncome(dto);
      
      if (response.data) {
        setSuccess(true);
        // Reset form
        setFormData({
          amount: "",
          notes: "",
          date: new Date().toISOString().split('T')[0]
        });
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      console.error("Error allocating income:", err);
      if (err instanceof Error) {
        setError(`Failed to allocate income: ${err.message}`);
      } else {
        setError("An error occurred while allocating income");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (success) {
    return (
      <Container
        maxWidth="600px"
        breadcrumbs={[
          { label: 'Home', path: '/budget/home' },
          { label: 'Add Income' }
        ]}
      >
        <SuccessMessage>
          <strong>Success!</strong> Income has been allocated successfully. 
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
        { label: 'Add Income' }
      ]}
    >
      <PageTitle align="center">Add Income</PageTitle>
      
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="amount">Income Amount *</Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0.01"
              placeholder="Enter income amount"
              required
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
              placeholder="Optional notes about this income..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" disabled={loading}>
              {loading ? "Allocating..." : "Allocate Income"}
            </Button>
            <Button type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
    </Container>
  );
};
