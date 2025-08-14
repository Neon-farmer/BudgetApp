import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'info'
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <MessageContainer>
        <IconContainer $variant={variant}>
          {variant === 'danger' && <DangerIcon>⚠️</DangerIcon>}
          {variant === 'warning' && <WarningIcon>⚠️</WarningIcon>}
          {variant === 'info' && <InfoIcon>ℹ️</InfoIcon>}
        </IconContainer>
        <Message>{message}</Message>
      </MessageContainer>
      
      <ButtonContainer>
        <Button 
          type="button" 
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <ConfirmButton 
          type="button" 
          onClick={handleConfirm}
          disabled={isLoading}
          $variant={variant}
        >
          {isLoading ? 'Processing...' : confirmText}
        </ConfirmButton>
      </ButtonContainer>
    </Modal>
  );
};

// Styled Components
const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IconContainer = styled.div<{ $variant: 'danger' | 'warning' | 'info' }>`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'danger': return `${theme.colors.danger}15`;
      case 'warning': return `${theme.colors.warning}15`;
      case 'info': return `${theme.colors.info}15`;
      default: return `${theme.colors.info}15`;
    }
  }};
`;

const DangerIcon = styled.span`
  font-size: 1.25rem;
`;

const WarningIcon = styled.span`
  font-size: 1.25rem;
`;

const InfoIcon = styled.span`
  font-size: 1.25rem;
`;

const Message = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const ConfirmButton = styled(Button)<{ $variant: 'danger' | 'warning' | 'info' }>`
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.info;
    }
  }};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: 1px solid ${({ theme, $variant }) => {
    switch ($variant) {
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.info;
    }
  }};
  
  &:hover:not(:disabled) {
    background: ${({ theme, $variant }) => {
      switch ($variant) {
        case 'danger': return theme.colors.danger;
        case 'warning': return theme.colors.warning;
        case 'info': return theme.colors.info;
        default: return theme.colors.info;
      }
    }};
    opacity: 0.9;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
    cursor: not-allowed;
  }
`;

export default ConfirmationModal;
