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
  const [sourceEnvelopeId, setSourceEnvelopeId] = useState<string>(envelopeId || "");
  const [destinationEnvelopeId, setDestinationEnvelopeId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envelopesLoading, setEnvelopesLoading] = useState(false);

  // Fetch envelopes for the dropdowns
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
    
    if (!sourceEnvelopeId || !destinationEnvelopeId || !amount.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (sourceEnvelopeId === destinationEnvelopeId) {
      setError("Source and destination envelopes must be different");
      return;
    }

    if (!budget || !budget.id) {
      setError("Budget information not loaded. Please try refreshing the page.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    const sourceEnvelopeIdNumber = parseInt(sourceEnvelopeId);
    const destinationEnvelopeIdNumber = parseInt(destinationEnvelopeId);
    if (isNaN(sourceEnvelopeIdNumber) || isNaN(destinationEnvelopeIdNumber)) {
      setError("Invalid envelopes selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transactionDate = new Date(date).toISOString();
      const transferNote = `Transfer to ${envelopes.find(e => e.id === destinationEnvelopeIdNumber)?.name || 'envelope'}`;

      // Create debit transaction from source envelope
      const debitTransaction = {
        EnvelopeId: sourceEnvelopeIdNumber,
        Notes: transferNote,
        Amount: -numericAmount,
        BudgetId: budget.id,
        Date: transactionDate
      };

      console.log("Creating debit transaction:", JSON.stringify(debitTransaction, null, 2));
      await budgetApi.createTransaction(debitTransaction);

      // Create credit transaction to destination envelope
      const creditTransaction = {
        EnvelopeId: destinationEnvelopeIdNumber,
        Notes: `Transfer from ${envelopes.find(e => e.id === sourceEnvelopeIdNumber)?.name || 'envelope'}`,
        Amount: numericAmount,
        BudgetId: budget.id,
        Date: transactionDate
      };

      console.log("Creating credit transaction:", JSON.stringify(creditTransaction, null, 2));
      const response = await budgetApi.createTransaction(creditTransaction);
      console.log("Transfer completed:", response);

      // Navigate back to the source envelope detail page
      navigate(`/budget/envelope/${sourceEnvelopeId}`);
    } catch (err) {
      console.error("Failed to complete transfer:", err);
      
      if (err instanceof ApiError) {
        setError(`Failed to complete transfer: ${err.message}`);
      } else {
        setError("Failed to complete transfer");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (sourceEnvelopeId) {
      navigate(`/budget/envelope/${sourceEnvelopeId}`);
    } else {
      navigate("/budget/envelopes");
    }
  };

  return (
    <Container
      maxWidth="600px"
      breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Transfer Money' }
      ]}
    >
      <PageTitle align="center">Transfer Money Between Envelopes</PageTitle>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="source-envelope">From Envelope *</Label>
          {envelopesLoading ? (
            <LoadingText>Loading envelopes...</LoadingText>
          ) : (
            <EnvelopeSelector
              id="source-envelope"
              name="source-envelope"
              envelopes={envelopes}
              value={sourceEnvelopeId}
              onChange={setSourceEnvelopeId}
              placeholder="Select source envelope"
              required
              disabled={envelopesLoading}
            />
          )}
          
        </FormGroup>

        <FormGroup>
          <Label htmlFor="destination-envelope">To Envelope *</Label>
          {envelopesLoading ? (
            <LoadingText>Loading envelopes...</LoadingText>
          ) : (
            <EnvelopeSelector
              id="destination-envelope"
              name="destination-envelope"
              envelopes={envelopes}
              value={destinationEnvelopeId}
              onChange={setDestinationEnvelopeId}
              placeholder="Select destination envelope"
              required
              disabled={envelopesLoading}
            />
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
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
            {loading ? "Transferring..." : "Transfer Money"}
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

const BalanceText = styled.small`
  display: block;
  margin-top: 4px;
  color: #666;
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
`;

const LoadingText = styled.div`
  padding: 12px;
  color: #666;
  font-style: italic;
  font-family: ${({ theme }) => theme.fonts.body};
`;
