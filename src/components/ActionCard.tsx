import React from "react";
import styled from "styled-components";
import { Button } from "./Button";

interface ActionCardProps {
  title: string;
  description?: string;
  buttonText?: string;
  onClick?: () => void;
  buttonColor?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  tooltip?: string;
  children?: React.ReactNode; // Allow custom content instead of just button
  variant?: 'default' | 'settings'; // Add variant for different styles
}

interface ActionGridProps {
  children: React.ReactNode;
  columns?: number;
  minCardWidth?: string;
}

const Card = styled.div<{ $variant?: string }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;
  
  ${props => props.$variant !== 'settings' && `
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      border-color: ${props.theme.colors.primary};
    }
  `}

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 12px 0;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 20px 0;
  line-height: 1.5;
  font-size: 0.95rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardActions = styled.div`
  margin-top: 0.5rem;
`;

const Grid = styled.div<{ $columns?: number; $minCardWidth?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.$minCardWidth || '250px'}, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  align-items: start;
  
  ${props => props.$columns && `
    @media (min-width: 768px) {
      grid-template-columns: repeat(${props.$columns}, 1fr);
    }
  `}
`;

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  buttonText,
  onClick,
  buttonColor = 'primary',
  disabled = false,
  tooltip,
  children,
  variant = 'default'
}) => {
  return (
    <Card $variant={variant}>
      <CardContent>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <CardActions>
          {children ? (
            children
          ) : buttonText && onClick ? (
            <Button 
              color={buttonColor} 
              onClick={onClick}
              disabled={disabled}
              tooltip={tooltip}
            >
              {buttonText}
            </Button>
          ) : null}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export const ActionGrid: React.FC<ActionGridProps> = ({ 
  children, 
  columns,
  minCardWidth 
}) => {
  return (
    <Grid $columns={columns} $minCardWidth={minCardWidth}>
      {children}
    </Grid>
  );
};
