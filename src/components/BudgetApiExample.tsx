import React, { useState, useEffect } from "react";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Budget } from "../services/types";
import { ApiError } from "../services/apiService";

/**
 * Example component demonstrating how to use the new API services
 * This shows different patterns for handling loading, errors, and data fetching
 */
export const BudgetApiExample: React.FC = () => {
  const budgetApi = useBudgetApi();
  
  // State management
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch budget on component mount
  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await budgetApi.getBudget();
      setBudget(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error (${err.status}): ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEnvelope = async () => {
    if (!budget) return;

    try {
      const newEnvelope = {
        EnvelopeName: `New Envelope ${Date.now()}`,
        BudgetId: budget.id,
        EnvelopeBalance: 100,
      };

      const response = await budgetApi.createEnvelope(newEnvelope);
      console.log("Created envelope:", response.data);
      
      // Refresh budget data to show the new envelope
      await fetchBudget();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to create envelope: ${err.message}`);
      } else {
        alert("Failed to create envelope");
      }
    }
  };

  const handleDeleteEnvelope = async (envelopeId: number) => {
    if (!confirm("Are you sure you want to delete this envelope?")) return;

    try {
      await budgetApi.deleteEnvelope(envelopeId);
      console.log("Deleted envelope:", envelopeId);
      
      // Refresh budget data
      await fetchBudget();
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Failed to delete envelope: ${err.message}`);
      } else {
        alert("Failed to delete envelope");
      }
    }
  };

  if (loading && !budget) {
    return <div>Loading budget...</div>;
  }

  if (error && !budget) {
    return (
      <div>
        <div>Error: {error}</div>
        <button onClick={fetchBudget}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Budget API Example</h2>
      
      {budget && (
        <div>
          <h3>Budget Information</h3>
          <p><strong>ID:</strong> {budget.id}</p>
          <p><strong>Tithe Feature:</strong> {budget.titheFeatureEnabled ? "Enabled" : "Disabled"}</p>
          
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Envelopes ({budget.envelopes?.length || 0})</h3>
              <button onClick={handleCreateEnvelope}>Create New Envelope</button>
            </div>
            
            {budget.envelopes && budget.envelopes.length > 0 ? (
              <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>Name</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>Balance</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>System</th>
                    <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {budget.envelopes.map((envelope) => (
                    <tr key={envelope.id}>
                      <td style={{ border: "1px solid #ccc", padding: "8px" }}>{envelope.name}</td>
                      <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "right" }}>
                        ${envelope.balance.toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                        {envelope.isSystemEnvelope ? "Yes" : "No"}
                      </td>
                      <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                        {!envelope.isSystemEnvelope && (
                          <button 
                            onClick={() => handleDeleteEnvelope(envelope.id)}
                            style={{ color: "red" }}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No envelopes found.</p>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <button onClick={fetchBudget} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Budget"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: "10px", color: "red" }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};
