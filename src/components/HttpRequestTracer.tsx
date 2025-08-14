import React, { useState } from "react";

/**
 * Component that shows the exact HTTP request details
 */
export const HttpRequestTracer: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{
      border: "2px solid #28a745",
      borderRadius: "8px",
      margin: "20px 0",
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{
        backgroundColor: "#28a745",
        color: "white",
        padding: "12px",
        borderRadius: "6px 6px 0 0",
        cursor: "pointer"
      }} onClick={() => setShowDetails(!showDetails)}>
        <h3 style={{ margin: 0 }}>
          🔍 HTTP Request Details {showDetails ? "▼" : "▶"}
        </h3>
      </div>

      {showDetails && (
        <div style={{ padding: "16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#28a745", marginBottom: "8px" }}>📍 Where the HTTP Request is Made</h4>
            <div style={{
              backgroundColor: "#e9ecef",
              padding: "12px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "14px"
            }}>
              <strong>File:</strong> src/utils/fetchApi.tsx<br/>
              <strong>Line:</strong> ~14<br/>
              <strong>Function:</strong> fetch()
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#dc3545", marginBottom: "8px" }}>🚀 Actual HTTP Request</h4>
            <div style={{
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              padding: "12px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px"
            }}>
              <strong>Method:</strong> GET<br/>
              <strong>URL:</strong> https://localhost:7083/envelope/1<br/>
              <strong>Headers:</strong><br/>
              &nbsp;&nbsp;Authorization: Bearer eyJ0eXAiOiJKV1Q...<br/>
              &nbsp;&nbsp;Content-Type: application/json<br/>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#6f42c1", marginBottom: "8px" }}>🎯 Backend Controller Hit</h4>
            <div style={{
              backgroundColor: "#e2e3f3",
              border: "1px solid #b8b9dc",
              padding: "12px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontSize: "12px"
            }}>
              [HttpGet("{"{id}"}")]{`\n`}
              public async Task&lt;IActionResult&gt; GetByEnvelopeID(int id){`\n`}
              {`{`}{`\n`}
              &nbsp;&nbsp;var envelope = await _envelopeService.GetEnvelopeByIdAsync(id);{`\n`}
              &nbsp;&nbsp;return Ok(envelope);{`\n`}
              {`}`}
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#fd7e14", marginBottom: "8px" }}>📡 Call Stack</h4>
            <div style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "12px"
            }}>
              1. EnvelopeDetailPage.tsx → useEffect()<br/>
              2. useApi.tsx → callApi()<br/>
              3. <strong style={{ color: "#dc3545" }}>fetchApi.tsx → fetch() ← HTTP REQUEST HERE</strong><br/>
              4. Your C# API Controller<br/>
              5. Database/Service Layer<br/>
              6. Response back through the chain
            </div>
          </div>

          <div>
            <h4 style={{ color: "#20c997", marginBottom: "8px" }}>⚡ New Service Call Stack</h4>
            <div style={{
              backgroundColor: "#d1ecf1",
              border: "1px solid #bee5eb",
              padding: "12px",
              borderRadius: "4px",
              fontSize: "12px"
            }}>
              1. NewEnvelopeDetail.tsx → useEffect()<br/>
              2. useBudgetApi.tsx → budgetApi.getEnvelope()<br/>
              3. budgetApiService.ts → this.apiService.get()<br/>
              4. <strong style={{ color: "#dc3545" }}>apiService.ts → fetch() ← HTTP REQUEST HERE</strong><br/>
              5. Your C# API Controller<br/>
              6. Database/Service Layer<br/>
              7. Response back through the chain
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
