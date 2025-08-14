import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Envelope } from "../services/types";
import { ApiError } from "../services/apiService";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { Button } from "../components/Button";
import { EnvelopeSelector } from "../components/EnvelopeSelector";
import styled from "styled-components";

export const AddTransactionPage = () => {
  const navigate = useNavigate();
  const { envelopeId } = useParams<{ envelopeId?: string }>();
  const budgetApi = useBudgetApi();

  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [budget, setBudget] = useState<any>(null);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string>(envelopeId || "");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envelopesLoading, setEnvelopesLoading] = useState(false);

  // Fetch envelopes for the dropdown
  useEffect(() => {
    fetchEnvelopes();
  }, []);

  const fetchEnvelopes = async () => {
    setEnvelopesLoading(true);
    try {
      // First get the budget to get the budget ID
      console.log("Calling API: GET /budget");
      const budgetResponse = await budgetApi.getBudget();
      console.log("Budget API Response:", budgetResponse);
      setBudget(budgetResponse.data);

      // Then get the envelopes using the budget ID
      console.log(`Calling API: GET /envelope?budgetId=${budgetResponse.data.id}`);
      const response = await budgetApi.getEnvelopes(budgetResponse.data.id);
      console.log("Envelopes API Response:", response);
      setEnvelopes(response.data);
    } catch (err) {
      console.error("Failed to fetch envelopes:", err);
      setError("Failed to load envelopes");
    } finally {
      setEnvelopesLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEnvelopeId || !description.trim() || !amount.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (!budget || !budget.id) {
      setError("Budget information not loaded. Please try refreshing the page.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    const envelopeIdNumber = parseInt(selectedEnvelopeId);
    if (isNaN(envelopeIdNumber)) {
      setError("Invalid envelope selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transactionData = {
        EnvelopeId: envelopeIdNumber,
        Notes: description.trim(),
        Amount: numericAmount,
        BudgetId: budget.id,
        Date: new Date(date).toISOString()
      };

      console.log("Creating transaction with data:", JSON.stringify(transactionData, null, 2));
      console.log("Budget object:", budget);
      console.log("Selected envelope ID:", selectedEnvelopeId);
      
      const response = await budgetApi.createTransaction(transactionData);
      console.log("Create transaction response:", response);

      // Navigate back to the envelope detail page
      navigate(`/budget/envelope/${selectedEnvelopeId}`);
    } catch (err) {
      console.error("Failed to create transaction:", err);
      
      if (err instanceof ApiError) {
        setError(`Failed to create transaction: ${err.message}`);
      } else {
        setError("Failed to create transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (selectedEnvelopeId) {
      navigate(`/budget/envelope/${selectedEnvelopeId}`);
    } else {
      navigate("/budget/envelopes");
    }
  };

  return (
    <Container
      maxWidth="600px"
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Add Transaction' }
      ]}
    >
      <PageTitle align="center">Add New Transaction</PageTitle>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="envelope">Envelope *</Label>
          {envelopesLoading ? (
            <LoadingText>Loading envelopes...</LoadingText>
          ) : (
            <EnvelopeSelector
              id="envelope"
              name="envelope"
              envelopes={envelopes}
              value={selectedEnvelopeId}
              onChange={setSelectedEnvelopeId}
              placeholder="Select an envelope"
              required
              disabled={envelopesLoading}
            />
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter transaction description"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
          <HelpText>Enter positive amount for credits, negative for debits</HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" disabled={loading || envelopesLoading}>
            {loading ? "Creating..." : "Create Transaction"}
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

const HelpText = styled.small`
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const LoadingText = styled.div`
  padding: 12px;
  color: #666;
  font-style: italic;
  font-family: ${({ theme }) => theme.fonts.body};
`;
