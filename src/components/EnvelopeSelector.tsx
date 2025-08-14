import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Envelope } from "../services/types";

interface EnvelopeSelectorProps {
  envelopes: Envelope[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export const EnvelopeSelector: React.FC<EnvelopeSelectorProps> = ({
  envelopes,
  value,
  onChange,
  placeholder = "Select an envelope",
  required = false,
  disabled = false,
  id,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedEnvelope = envelopes.find((env) => env.id.toString() === value);

  const filteredEnvelopes = envelopes.filter((envelope) =>
    envelope.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (envelope: Envelope) => {
    onChange(envelope.id.toString());
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setSearchTerm("");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <SelectorContainer ref={dropdownRef}>
      <SelectorButton
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        $isOpen={isOpen}
        $hasValue={!!selectedEnvelope}
        disabled={disabled}
        id={id}
        name={name}
      >
        {selectedEnvelope ? (
          <SelectedEnvelope>
            <EnvelopeName>{selectedEnvelope.name}</EnvelopeName>
            <EnvelopeBalance $isPositive={selectedEnvelope.balance >= 0}>
              {formatCurrency(selectedEnvelope.balance)}
            </EnvelopeBalance>
          </SelectedEnvelope>
        ) : (
          <PlaceholderText>{placeholder}</PlaceholderText>
        )}

        <ButtonActions>
          {selectedEnvelope && !disabled && (
            <ClearButton onClick={handleClear} title="Clear selection">
              ×
            </ClearButton>
          )}
          <ChevronIcon $isOpen={isOpen}>▼</ChevronIcon>
        </ButtonActions>
      </SelectorButton>

      {isOpen && (
        <DropdownContainer>
          <SearchInput
            ref={inputRef}
            type="text"
            placeholder="Search envelopes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <EnvelopeList>
            {filteredEnvelopes.length === 0 ? (
              <NoResults>No envelopes found</NoResults>
            ) : (
              filteredEnvelopes.map((envelope) => (
                <EnvelopeOption
                  key={envelope.id}
                  onClick={() => handleSelect(envelope)}
                  $isSelected={envelope.id.toString() === value}
                  $isPositive={envelope.balance >= 0}
                >
                  <EnvelopeInfo>
                    <EnvelopeName>{envelope.name}</EnvelopeName>
                    <EnvelopeBalance $isPositive={envelope.balance >= 0}>
                      {formatCurrency(envelope.balance)}
                    </EnvelopeBalance>
                  </EnvelopeInfo>
                  <BalanceIndicator $isPositive={envelope.balance >= 0} />
                </EnvelopeOption>
              ))
            )}
          </EnvelopeList>
        </DropdownContainer>
      )}

      {/* Hidden input for form submission */}
      <HiddenInput
        type="hidden"
        value={value}
        name={name}
        required={required && !value}
      />
    </SelectorContainer>
  );
};

// Styled Components
const SelectorContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectorButton = styled.button<{ $isOpen: boolean; $hasValue: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid
    ${({ theme, $isOpen }) => ($isOpen ? theme.colors.primary : "#e5e7eb")};
  border-radius: 8px;
  background: white;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
  font-family: ${({ theme }) => theme.fonts.body};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SelectedEnvelope = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-right: 12px;
`;

const PlaceholderText = styled.span`
  color: #9ca3af;
  font-size: 1rem;
`;

const ButtonActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ChevronIcon = styled.span<{ $isOpen: boolean }>`
  color: #6b7280;
  font-size: 12px;
  transition: transform 0.2s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EnvelopeList = styled.div`
  max-height: 240px;
  overflow-y: auto;
`;

const EnvelopeOption = styled.div<{
  $isSelected: boolean;
  $isPositive: boolean;
}>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid transparent;
  background: ${({ $isSelected }) => ($isSelected ? "#f0f9ff" : "white")};

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#e0f2fe" : "#f9fafb")};
  }

  ${({ $isSelected, theme }) =>
    $isSelected &&
    `
    border-left-color: ${theme.colors.primary};
  `}
`;

const EnvelopeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const EnvelopeName = styled.span`
  font-weight: 500;
  color: #111827;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EnvelopeBalance = styled.span<{ $isPositive: boolean }>`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${({ $isPositive }) => ($isPositive ? "#059669" : "#dc2626")};
  margin-left: 12px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const BalanceIndicator = styled.div<{ $isPositive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $isPositive }) => ($isPositive ? "#10b981" : "#ef4444")};
  margin-left: 12px;
  flex-shrink: 0;
`;

const NoResults = styled.div`
  padding: 16px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;
