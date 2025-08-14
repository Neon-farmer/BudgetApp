import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { ApiError } from "../services/apiService";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import {
  PageContainer as Container,
  commonBreadcrumbs,
} from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import styled from "styled-components";

export const AddEnvelopePage = () => {
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();

  const [budgetId, setBudgetId] = useState<number | null>(null);
  const [envelopeName, setEnvelopeName] = useState("");
  const [envelopeBalance, setEnvelopeBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);

  // Get the budget ID when component mounts
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await budgetApi.getBudget();
        setBudgetId(response.data.id);
      } catch (err) {
        console.error("Failed to fetch budget:", err);
        if (err instanceof ApiError) {
          setError(`Failed to load budget: ${err.message}`);
        } else {
          setError("Failed to load budget");
        }
      } finally {
        setBudgetLoading(false);
      }
    };

    fetchBudget();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!budgetId) {
      setError("Budget ID is required");
      return;
    }

    if (!envelopeName.trim()) {
      setError("Envelope name is required");
      return;
    }

    const balance = parseFloat(envelopeBalance) || 0;

    setLoading(true);
    setError(null);

    try {
      const newEnvelope = {
        EnvelopeName: envelopeName.trim(),
        BudgetId: budgetId,
        EnvelopeBalance: balance,
      };

      console.log("Creating envelope:", newEnvelope);
      const response = await budgetApi.createEnvelope(newEnvelope);
      console.log("Envelope created:", response);

      // Navigate back to envelopes page
      navigate("/budget/envelopes");
    } catch (err) {
      console.error("Failed to create envelope:", err);
      if (err instanceof ApiError) {
        setError(`Failed to create envelope: ${err.message}`);
      } else {
        setError("Failed to create envelope");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/budget/envelopes");
  };

  const handleBackToHome = () => {
    navigate("/budget/home");
  };

  if (budgetLoading) {
    return (
      <Container>
        <Loading message="Loading budget..." size="lg" />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="600px"
      breadcrumbs={[
        ...commonBreadcrumbs.envelopes,
        { label: "Add Envelope", path: "" },
      ]}
    >
      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}
      <PageTitle>Add New Envelope</PageTitle>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="envelopeName">Envelope Name *</Label>
          <Input
            type="text"
            id="envelopeName"
            name="envelopeName"
            value={envelopeName}
            onChange={(e) => setEnvelopeName(e.target.value)}
            placeholder="Enter envelope name"
            required
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="envelopeBalance">Starting Balance</Label>
          <Input
            type="number"
            id="envelopeBalance"
            name="envelopeBalance"
            step="0.01"
            value={envelopeBalance}
            onChange={(e) => setEnvelopeBalance(e.target.value)}
            placeholder="0.00"
            disabled={loading}
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" disabled={loading || !envelopeName.trim()}>
            {loading ? "Creating..." : "Create Envelope"}
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
