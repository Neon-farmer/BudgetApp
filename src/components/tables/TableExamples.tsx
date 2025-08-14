// Example usage of Table components

import React, { useState } from 'react';
import { Table, Column, StatusBadge, CurrencyCell, AutoCurrencyCell, ActionCell } from './Table';
import { DraggableTable, DraggableTableColumn } from './DraggableTable';
import { Button } from '../Button';

// Example 1: Basic Table Usage
export const BasicTableExample = () => {
  const [data] = useState([
    { id: 1, name: "Groceries", amount: -120.50, status: "completed", date: "2024-01-15" },
    { id: 2, name: "Salary", amount: 3000.00, status: "pending", date: "2024-01-16" },
    { id: 3, name: "Utilities", amount: -85.30, status: "overdue", date: "2024-01-17" },
  ]);

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Transaction',
      width: '30%'
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (value) => (
        <AutoCurrencyCell value={value} />
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (value) => {
        const variant = value === 'completed' ? 'success' : 
                      value === 'pending' ? 'warning' : 'danger';
        return <StatusBadge $variant={variant}>{value}</StatusBadge>;
      }
    },
    {
      key: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <ActionCell>
          <Button onClick={() => console.log('Edit', row)}>Edit</Button>
          <Button onClick={() => console.log('Delete', row)}>Delete</Button>
        </ActionCell>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey="id"
      onRowClick={(row) => console.log('Row clicked:', row)}
      hoverable
    />
  );
};

// Example 2: Draggable Table (for Planner Page)
export const PlannerTableExample = () => {
  const [plans, setPlans] = useState([
    { id: 1, name: "Emergency Fund", priority: 1, amount: 1000, status: "active" },
    { id: 2, name: "Vacation", priority: 2, amount: 2500, status: "active" },
    { id: 3, name: "Car Repair", priority: 3, amount: 800, status: "paused" },
  ]);

  const columns: DraggableTableColumn<any>[] = [
    {
      key: 'name',
      header: 'Plan Name',
      width: '40%'
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => `#${value}`
    },
    {
      key: 'amount',
      header: 'Target Amount',
      render: (value) => (
        <CurrencyCell>
          ${value.toFixed(2)}
        </CurrencyCell>
      )
    },
    {
      key: 'status',
      header: 'Status',
      hideOnMobile: true, // Hide status column on mobile for better fit
      render: (value) => (
        <StatusBadge $variant={value === 'active' ? 'success' : 'warning'}>
          {value}
        </StatusBadge>
      )
    }
  ];

  const handleReorder = async (newOrder: any[]) => {
    // Update priorities based on new order
    const updatedItems = newOrder.map((item, index) => ({
      ...item,
      priority: index + 1
    }));

    setPlans(updatedItems);
  };

  return (
    <DraggableTable
      columns={columns}
      data={plans}
      getRowKey={(plan) => plan.id}
      onReorder={handleReorder}
    />
  );
};

// Example 3: Loading and Empty States
export const TableStatesExample = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const columns: Column[] = [
    { key: 'name', header: 'Name' },
    { key: 'value', header: 'Value' },
  ];

  const loadData = () => {
    setLoading(true);
    setTimeout(() => {
      setData([
        { id: 1, name: 'Item 1', value: 'Value 1' },
        { id: 2, name: 'Item 2', value: 'Value 2' },
      ]);
      setLoading(false);
    }, 2000);
  };

  const clearData = () => {
    setData([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Button onClick={loadData}>Load Data</Button>
        <Button onClick={clearData}>Clear Data</Button>
      </div>
      
      <Table
        columns={columns}
        data={data}
        loading={loading}
        empty={
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No data available</p>
            <Button onClick={loadData}>Load Sample Data</Button>
          </div>
        }
      />
    </div>
  );
};

// Example 4: Responsive Table Features
export const ResponsiveTableExample = () => {
  const data = [
    { 
      id: 1, 
      name: "Very Long Transaction Name That Might Wrap", 
      category: "Food & Dining",
      amount: -45.67,
      date: "2024-01-15",
      account: "Checking Account"
    },
    { 
      id: 2, 
      name: "Short Name", 
      category: "Income",
      amount: 1500.00,
      date: "2024-01-16",
      account: "Savings Account"
    },
  ];

  const columns: Column[] = [
    {
      key: 'name',
      header: 'Transaction',
      width: '25%'
    },
    {
      key: 'category',
      header: 'Category',
      width: '20%'
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      width: '15%',
      render: (value) => (
        <AutoCurrencyCell value={value} />
      )
    },
    {
      key: 'date',
      header: 'Date',
      width: '15%',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'account',
      header: 'Account',
      width: '25%'
    }
  ];

  return (
    <div>
      <h3>Compact Mobile-Friendly Table</h3>
      <Table
        columns={columns}
        data={data}
        compact
        striped
      />
    </div>
  );
};
