import React from 'react';
import styled from 'styled-components';

// Table Types
export interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  empty?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T, index: number) => void;
  rowKey?: keyof T | ((row: T, index: number) => string | number);
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

// Base Table Component
export const Table = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  empty,
  className,
  onRowClick,
  rowKey,
  striped = false,
  hoverable = true,
  compact = false
}: TableProps<T>) => {
  const getRowKey = (row: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(row, index);
    } else if (rowKey) {
      return row[rowKey];
    }
    return index;
  };

  const getCellValue = (row: T, column: Column<T>): any => {
    const keys = column.key.split('.');
    let value = row;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  };

  if (loading) {
    return (
      <TableWrapper className={className}>
        <LoadingContainer>
          <LoadingMessage>Loading...</LoadingMessage>
        </LoadingContainer>
      </TableWrapper>
    );
  }

  if (data.length === 0) {
    return (
      <TableWrapper className={className}>
        <EmptyContainer>
          {empty || <EmptyMessage>No data available</EmptyMessage>}
        </EmptyContainer>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper className={className}>
      <StyledTable $compact={compact}>
        <TableHeader>
          <HeaderRow>
            {columns.map((column) => (
              <HeaderCell
                key={column.key}
                $width={column.width}
                $align={column.align}
                $sortable={column.sortable}
              >
                {column.header}
              </HeaderCell>
            ))}
          </HeaderRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={getRowKey(row, index)}
              $clickable={!!onRowClick}
              $striped={striped && index % 2 === 1}
              $hoverable={hoverable}
              onClick={() => onRowClick?.(row, index)}
            >
              {columns.map((column) => {
                const value = getCellValue(row, column);
                return (
                  <TableCell
                    key={column.key}
                    $align={column.align}
                    $compact={compact}
                  >
                    {column.render ? column.render(value, row, index) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableWrapper>
  );
};

// Styled Components
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin: 16px 0 !important;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: white;
  
  @media (min-width: 768px) {
    margin: 20px 0 !important;
    overflow-x: visible;
  }
`;

const StyledTable = styled.table<{ $compact: boolean }>`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ $compact }) => $compact ? '0.8rem' : '0.9rem'};
  table-layout: fixed;
  
  @media (min-width: 768px) {
    font-size: ${({ $compact }) => $compact ? '0.9rem' : '1rem'};
    table-layout: auto;
  }
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th<{
  $width?: string;
  $align?: 'left' | 'center' | 'right';
  $sortable?: boolean;
}>`
  padding: 8px 12px;
  text-align: ${({ $align }) => $align || 'left'};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.8rem;
  width: ${({ $width }) => $width || 'auto'};
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
  
  @media (min-width: 768px) {
    padding: 15px 20px;
    font-size: 1rem;
  }

  ${({ $sortable }) => $sortable && `
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{
  $clickable: boolean;
  $striped: boolean;
  $hoverable: boolean;
}>`
  border-bottom: 1px solid #e5e7eb;
  background: ${({ $striped, theme }) => 
    $striped ? theme.colors.gray?.[50] || '#f9fafb' : 'transparent'};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};

  &:last-child {
    border-bottom: none;
  }

  ${({ $hoverable, $clickable, theme }) => ($hoverable || $clickable) && `
    &:hover {
      background: ${theme.colors.gray?.[100] || '#f3f4f6'};
    }
  `}
`;

const TableCell = styled.td<{
  $align?: 'left' | 'center' | 'right';
  $compact: boolean;
}>`
  padding: ${({ $compact }) => $compact ? '6px 12px' : '8px 12px'};
  text-align: ${({ $align }) => $align || 'left'};
  font-family: ${({ theme }) => theme.fonts.body};
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  vertical-align: middle;
  
  tr:last-child &:first-child {
    border-bottom-left-radius: 8px;
  }
  
  tr:last-child &:last-child {
    border-bottom-right-radius: 8px;
  }
  
  @media (min-width: 768px) {
    padding: ${({ $compact }) => $compact ? '10px 20px' : '15px 20px'};
  }
`;

const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
`;

const LoadingMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EmptyContainer = styled.div`
  padding: 40px;
  text-align: center;
`;

const EmptyMessage = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

// Utility Components for common patterns
export const ActionCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
`;

export const StatusBadge = styled.span<{ $variant: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return theme.colors.success + '20';
      case 'warning': return theme.colors.warning + '20';
      case 'danger': return theme.colors.danger + '20';
      case 'info': return theme.colors.info + '20';
      default: return theme.colors.gray?.[200] || '#e5e7eb';
    }
  }};
  
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success': return theme.colors.success;
      case 'warning': return theme.colors.warning;
      case 'danger': return theme.colors.danger;
      case 'info': return theme.colors.info;
      default: return theme.colors.text.secondary;
    }
  }};
`;

export const CurrencyCell = styled.span<{ $negative?: boolean }>`
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.mono || 'monospace'};
  color: ${({ $negative, theme }) => 
    $negative ? theme.colors.danger : theme.colors.success};
`;

// Enhanced CurrencyCell that automatically determines positive/negative
export const AutoCurrencyCell: React.FC<{ 
  value: number; 
  showSign?: boolean;
  precision?: number;
  className?: string;
}> = ({ value, showSign = false, precision = 2, className }) => (
  <CurrencyCell $negative={value < 0} className={className}>
    {showSign && value > 0 ? '+' : ''}${Math.abs(value).toFixed(precision)}
  </CurrencyCell>
);
