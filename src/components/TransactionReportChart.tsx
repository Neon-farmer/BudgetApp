import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Transaction, Envelope } from '../services/types';
import { aggregateByEnvelope, aggregateByDate } from '../utils/filterTransactions';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    min-height: 300px;
  }
  
  @media (min-width: 769px) {
    height: 400px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text-primary, #333);
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EmptyStateMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary, #666);
  font-style: italic;
`;

// Recharts color palette
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF7C7C',
  '#8DD1E1',
  '#D084D0',
];

const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

interface TransactionReportChartProps {
  transactions: Transaction[];
  envelopes: Envelope[];
  chartType: 'pie' | 'line';
}

/**
 * Component to display transaction data as pie or line charts
 */
export const TransactionReportChart: React.FC<TransactionReportChartProps> = ({
  transactions,
  envelopes,
  chartType,
}) => {
  // Create a map of envelope ID to name
  const envelopeMap = useMemo(() => {
    return envelopes.reduce(
      (map, env) => {
        map[env.id] = env.name;
        return map;
      },
      {} as Record<number, string>
    );
  }, [envelopes]);

  // Aggregate data based on chart type
  const chartData = useMemo(() => {
    if (chartType === 'pie') {
      // Aggregate by envelope
      const aggregated = aggregateByEnvelope(transactions);
      return Object.entries(aggregated).map(([envelopeId, amount]) => ({
        name: envelopeMap[Number(envelopeId)] || `Envelope ${envelopeId}`,
        value: Math.round(amount * 100) / 100, // Round to 2 decimals
        envelopeId: Number(envelopeId),
      }));
    } else {
      // Aggregate by date for line chart
      return aggregateByDate(transactions).map((item) => ({
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        amount: Math.round(item.amount * 100) / 100, // Round to 2 decimals
      }));
    }
  }, [transactions, chartType, envelopeMap]);

  if (transactions.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>
          {chartType === 'pie' ? 'Transactions by Envelope' : 'Spending Over Time'}
        </ChartTitle>
        <EmptyStateMessage>No transactions to display</EmptyStateMessage>
      </ChartContainer>
    );
  }

  if (chartData.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>
          {chartType === 'pie' ? 'Transactions by Envelope' : 'Spending Over Time'}
        </ChartTitle>
        <EmptyStateMessage>No data available for the selected period</EmptyStateMessage>
      </ChartContainer>
    );
  }

  const isMobileView = isMobile();

  return (
    <ChartContainer>
      <ChartTitle>
        {chartType === 'pie' ? 'Transactions by Envelope' : 'Spending Over Time'}
      </ChartTitle>

      <ResponsiveContainer width="100%" height={isMobileView ? 300 : 350}>
        {chartType === 'pie' && chartData.length > 0 ? (
          <PieChart>
            <Pie
              data={chartData as any}
              cx="50%"
              cy="50%"
              labelLine={!isMobileView}
              label={(entry: any) => {
                const percent = entry.percent ?? 0;
                if (isMobileView) {
                  return `${(percent * 100).toFixed(0)}%`;
                } else {
                  const name = entry.name || '';
                  return `${name} (${(percent * 100).toFixed(0)}%)`;
                }
              }}
              outerRadius={isMobileView ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `$${value.toFixed(2)}`;
                }
                return value;
              }}
            />
            <Legend />
          </PieChart>
        ) : (
          <LineChart data={chartData as any}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={isMobileView ? -45 : -45}
              textAnchor="end"
              height={isMobileView ? 60 : 80}
            />
            <YAxis
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') {
                  return `$${value.toFixed(2)}`;
                }
                return value;
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              dot={{ fill: '#8884d8' }}
              name="Daily Spending"
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};
