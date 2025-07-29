import { useState } from "react";
import { useApi } from "../hooks/useApi";

interface Envelope {
  id: number;
  name: string;
  amount: number;
}

interface BudgetData {
  id: number;
  titheFeatureEnabled: boolean;
  envelopes: Envelope[];
}

export const ApiCall = () => {
  const { callApi, loading, error } = useApi();
  const [data, setData] = useState<BudgetData | null>(null);

  const handleClick = async () => {
    try {
      const result = await callApi('/budget', { method: 'GET' });
      setData(result);
    } catch (err) {
      console.error('API call failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        Call API            
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h3>API Response:</h3>
          <p><strong>ID:</strong> {data.id}</p>
          <p><strong>Tithe Feature Enabled:</strong> {data.titheFeatureEnabled ? "Yes" : "No"}</p>
          
          <h4>Envelopes:</h4>
          {data.envelopes && data.envelopes.length > 0 ? (
            <ul>
              {data.envelopes.map((envelope) => (
                <li key={envelope.id}>
                  {envelope.name} - ${envelope.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No envelopes found</p>
          )}
        </div>
      )}
    </div>
  );
}