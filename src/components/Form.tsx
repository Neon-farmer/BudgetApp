import React from 'react';
import styled from 'styled-components';

// Form Container
export const FormContainer = styled.form`
  width: 100%;
`;

export const FormSection = styled.div`
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    margin-bottom: 32px;
  }
`;

// Label Component
export const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

// Base Input Styles
const baseInputStyles = (theme: any) => `
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 16px;
  transition: all 0.2s ease;
  font-family: inherit;
  box-sizing: border-box;
  background: white;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (min-width: 768px) {
    padding: 14px 18px;
  }
`;

// Input Component
export const Input = styled.input`
  ${({ theme }) => baseInputStyles(theme)}
`;

// TextArea Component
export const TextArea = styled.textarea`
  ${({ theme }) => baseInputStyles(theme)}
  min-height: 100px;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.body};
`;

// Select Component
export const Select = styled.select`
  ${({ theme }) => baseInputStyles(theme)}
  cursor: pointer;
  
  option {
    padding: 8px;
  }
`;

// Form Group for organizing related inputs
export const FormGroup = styled.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
`;

// Form Row for side-by-side inputs
export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 20px;
    
    > * {
      flex: 1;
    }
  }
`;

// Error Message Component
export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
  margin-top: -12px;
  margin-bottom: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

// Help Text Component
export const HelpText = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-top: -12px;
  margin-bottom: 16px;
  line-height: 1.4;
  font-family: ${({ theme }) => theme.fonts.body};
`;

// Checkbox and Radio Components
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const RadioLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.body};
  cursor: pointer;
  font-size: 0.95rem;
`;

// Form Actions Container
export const FormActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 16px;
  }
`;

// Required Indicator
export const Required = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  margin-left: 4px;
`;

// Compound Components for common patterns
interface FormFieldProps {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helpText,
  required,
  children
}) => (
  <FormGroup>
    <Label>
      {label}
      {required && <Required>*</Required>}
    </Label>
    {children}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {helpText && !error && <HelpText>{helpText}</HelpText>}
  </FormGroup>
);

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  helpText?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  error,
  helpText
}) => (
  <FormGroup>
    <CheckboxContainer>
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <Label as="span" style={{ marginBottom: 0 }}>
          {label}
        </Label>
        {helpText && <HelpText style={{ marginTop: 4, marginBottom: 0 }}>{helpText}</HelpText>}
        {error && <ErrorMessage style={{ marginTop: 4, marginBottom: 0 }}>{error}</ErrorMessage>}
      </div>
    </CheckboxContainer>
  </FormGroup>
);

interface RadioFieldProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helpText,
  required
}) => (
  <FormGroup>
    <Label>
      {label}
      {required && <Required>*</Required>}
    </Label>
    <RadioContainer>
      {options.map((option) => (
        <RadioOption key={option.value}>
          <Radio
            name={label}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
          />
          <RadioLabel>{option.label}</RadioLabel>
        </RadioOption>
      ))}
    </RadioContainer>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    {helpText && !error && <HelpText>{helpText}</HelpText>}
  </FormGroup>
);
