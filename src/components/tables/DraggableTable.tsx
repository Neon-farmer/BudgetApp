import React, { useState } from 'react';
import styled from 'styled-components';

export interface DraggableTableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface DraggableTableProps<T> {
  data: T[];
  columns: DraggableTableColumn<T>[];
  onReorder: (newOrder: T[]) => Promise<void>;
  onRowClick?: (item: T, index: number) => void;
  getRowKey: (item: T) => string | number;
  dragHandleContent?: React.ReactNode;
  loading?: boolean;
  empty?: React.ReactNode;
  className?: string;
}

export function DraggableTable<T>({
  data,
  columns,
  onReorder,
  onRowClick,
  getRowKey,
  dragHandleContent = '⋮⋮',
  loading,
  empty,
  className
}: DraggableTableProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setDragOverIndex(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    await reorderItems(draggedIndex, dropIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setTouchStartY(e.touches[0].clientY);
    setDraggedIndex(index);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || draggedIndex === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = Math.abs(currentY - touchStartY);

    // Start dragging after minimum movement
    if (deltaY > 10 && !isDragging) {
      setIsDragging(true);
      e.preventDefault();
    }

    if (isDragging) {
      e.preventDefault();
      
      // Find which row we're over
      const touch = e.touches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const row = elementBelow?.closest('[data-row-index]');
      
      if (row) {
        const index = parseInt(row.getAttribute('data-row-index') || '0');
        if (index !== draggedIndex) {
          setDragOverIndex(index);
        }
      }
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (isDragging && draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      await reorderItems(draggedIndex, dragOverIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTouchStartY(null);
    setIsDragging(false);
  };

  const reorderItems = async (fromIndex: number, toIndex: number) => {
    const newOrder = [...data];
    const [draggedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, draggedItem);
    
    try {
      await onReorder(newOrder);
    } catch (error) {
      console.error('Error reordering items:', error);
    }
  };

  const getValue = (item: T, key: keyof T | string): any => {
    return typeof key === 'string' && key.includes('.') 
      ? key.split('.').reduce((obj, k) => obj?.[k], item as any)
      : item[key as keyof T];
  };

  if (loading) {
    return (
      <TableContainer className={className}>
        <LoadingMessage>Loading...</LoadingMessage>
      </TableContainer>
    );
  }

  if (data.length === 0) {
    return (
      <TableContainer className={className}>
        {empty || <EmptyMessage>No items to display</EmptyMessage>}
      </TableContainer>
    );
  }

  return (
    <TableContainer className={className}>
      <Table>
        <TableHeader>
          <tr>
            <DragColumnHeader />
            {columns.map((column, index) => (
              <TableHeaderCell 
                key={index} 
                $width={column.width} 
                $hideOnMobile={column.hideOnMobile}
              >
                {column.header}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={getRowKey(item)}
              data-row-index={index}
              $isDragging={draggedIndex === index}
              $isDragOver={dragOverIndex === index}
              $isTouchDragging={isDragging && draggedIndex === index}
              draggable={true}
              onClick={() => !isDragging && onRowClick?.(item, index)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <DragCell>
                <DragHandle>{dragHandleContent}</DragHandle>
              </DragCell>
              {columns.map((column, colIndex) => (
                <TableCell 
                  key={colIndex} 
                  $hideOnMobile={column.hideOnMobile}
                >
                  {column.render 
                    ? column.render(getValue(item, column.key), item, index)
                    : String(getValue(item, column.key))
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Styled Components
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    margin-left: -10px;
    margin-right: -10px;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  /* Hide scrollbar on webkit browsers for cleaner look */
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 320px; // Reduced from 600px for better mobile fit

  @media (max-width: 768px) {
    min-width: 280px; // Even smaller on mobile
    font-size: 0.875rem; // Smaller text on mobile
  }
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
`;

const TableHeaderCell = styled.th<{ $width?: string; $hideOnMobile?: boolean }>`
  padding: 15px 20px;
  text-align: left; // Always left align
  font-weight: 600;
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.body};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: ${({ $width }) => $width || 'auto'};

  @media (max-width: 768px) {
    padding: 10px 8px; // More compact
    font-size: 0.75rem; // Smaller text
    ${({ $hideOnMobile }) => $hideOnMobile && 'display: none;'}
  }
`;

const DragColumnHeader = styled.th`
  width: 50px;
  padding: 15px 10px;

  @media (max-width: 768px) {
    width: 30px; // Reduced from 40px
    padding: 12px 5px; // Less padding
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ 
  $isDragging?: boolean; 
  $isDragOver?: boolean;
  $isTouchDragging?: boolean;
}>`
  border-bottom: 1px solid #e5e7eb;
  cursor: ${({ $isTouchDragging }) => $isTouchDragging ? 'grabbing' : 'grab'};
  background: ${({ $isDragging, $isDragOver, $isTouchDragging }) => {
    if ($isDragging || $isTouchDragging) return '#e0f2fe';
    if ($isDragOver) return '#f0f9ff';
    return 'white';
  }};
  transition: all 0.2s ease;
  position: relative;
  touch-action: ${({ $isTouchDragging }) => $isTouchDragging ? 'none' : 'auto'};

  &:hover {
    background: ${({ $isDragging, $isDragOver, $isTouchDragging }) => {
      if ($isDragging || $isTouchDragging) return '#e0f2fe';
      if ($isDragOver) return '#f0f9ff';
      return '#f9fafb';
    }};
  }

  &:last-child {
    border-bottom: none;
  }

  ${({ $isDragOver }) => $isDragOver && `
    border-top: 3px solid #3b82f6;
    box-shadow: 0 -2px 8px rgba(59, 130, 246, 0.3);
  `}
`;

const TableCell = styled.td<{ $hideOnMobile?: boolean }>`
  padding: 18px 20px;
  vertical-align: middle;
  text-align: left; // Always left align
  font-family: ${({ theme }) => theme.fonts.body};

  @media (max-width: 768px) {
    padding: 12px 8px; // More compact padding
    font-size: 0.875rem; // Smaller text
    ${({ $hideOnMobile }) => $hideOnMobile && 'display: none;'}
  }
`;

const DragCell = styled(TableCell)`
  width: 50px;
  padding: 18px 10px;

  @media (max-width: 768px) {
    width: 30px; // Reduced from 40px
    padding: 15px 5px; // Less padding
  }
`;

const DragHandle = styled.div`
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: grab;
  user-select: none;
  text-align: center;
  touch-action: none;

  &:hover {
    color: #6b7280;
  }

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-family: ${({ theme }) => theme.fonts.body};
`;
