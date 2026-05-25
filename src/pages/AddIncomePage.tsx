import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { AllocateIncomeDto, Envelope, CreateTransactionRequest } from "../services/types";
import { EnvelopeSelector } from "../components/EnvelopeSelector";

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

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleText = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  color: ${({ theme }) => theme.colors.text};
`;

const SwitchRole = styled.label`
  position: relative;
  width: 56px;
  height: 28px;
  display: inline-block;
  vertical-align: middle;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.gray?.[200] || '#e5e7eb'};
  transition: 0.2s;
  border-radius: 999px;

  &::before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    left: 3px;
    top: 3px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: 0.2s;
  }

  input:checked + & {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  input:checked + &::before {
    transform: translateX(28px);
  }
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
  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string>("");
  const [allocationMode, setAllocationMode] = useState<'planner' | 'direct'>('planner');
  
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
      if (allocationMode === 'planner') {
        const dto: AllocateIncomeDto = {
          Amount: amount,
          Notes: formData.notes || "",
          Date: formData.date
        };

        const response = await budgetApi.allocateIncome(dto);
        if (!response.data) {
          throw new Error(response.message || 'Failed to allocate income via planner');
        }
      } else {
        // Direct to envelope: create a transaction against the selected envelope
        if (!selectedEnvelopeId) {
          setError('Please select an envelope to allocate income to');
          setLoading(false);
          return;
        }

        if (!budgetId) {
          setError('Budget not loaded yet');
          setLoading(false);
          return;
        }

        const txDto: CreateTransactionRequest = {
          Amount: amount,
          Notes: formData.notes || '',
          EnvelopeId: parseInt(selectedEnvelopeId, 10),
          BudgetId: budgetId,
          Date: formData.date
        };

        const createResp = await budgetApi.createTransaction(txDto);
        if (!createResp.data) {
          throw new Error(createResp.message || 'Failed to create transaction');
        }
      }
      // If we reach here no error was thrown: allocation/create succeeded
      setSuccess(true);
      // Reset form
      setFormData({
        amount: "",
        notes: "",
        date: new Date().toISOString().split('T')[0]
      });

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/budget/home");
      }, 2000);
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

  // Load budget and envelopes on mount
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const b = await budgetApi.getBudget();
        if (!mounted) return;
        if (b.data) {
          setBudgetId(b.data.id);
          try {
            const envResp = await budgetApi.getEnvelopes(b.data.id);
            if (envResp.data) setEnvelopes(envResp.data);
          } catch (e) {
            // ignore envelope load errors; they'll be empty
            console.debug('Failed to load envelopes for AddIncomePage', e);
          }
        }
      } catch (e) {
        console.debug('Failed to load budget for AddIncomePage', e);
      }
    };

    load();
    return () => { mounted = false; };
  }, [budgetApi]);

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
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/planner')}>Open Planner</Button>
        </ButtonGroup>
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

          <FormGroup>
            <Label>Allocation Method</Label>
            <ToggleRow>
              <ToggleText>Planner</ToggleText>
              <SwitchRole>
                <input
                  type="checkbox"
                  checked={allocationMode === 'direct'}
                  onChange={() => setAllocationMode(allocationMode === 'planner' ? 'direct' : 'planner')}
                  aria-label="Toggle allocation mode"
                />
                <SwitchSlider />
              </SwitchRole>
              <ToggleText>Direct</ToggleText>
            </ToggleRow>
            {allocationMode === 'planner' && (
              <div style={{ marginTop: 8, color: '#374151' }}>
                The planner will automatically distribute this income to your plans/envelopes according to priorities.
              </div>
            )}
          </FormGroup>

          {allocationMode === 'direct' && (
            <FormGroup>
              <Label>Envelope</Label>
              <EnvelopeSelector
                envelopes={envelopes}
                value={selectedEnvelopeId}
                onChange={(v) => setSelectedEnvelopeId(v)}
                placeholder="Select envelope to receive income"
                required
              />
            </FormGroup>
          )}

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
