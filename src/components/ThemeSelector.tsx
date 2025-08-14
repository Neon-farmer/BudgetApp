import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../css/ThemeProvider';

export const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <SelectorWrapper>
      <SelectorLabel>Theme:</SelectorLabel>
      <Select 
        value={currentTheme.name} 
        onChange={(e) => {
          const selectedTheme = availableThemes.find(t => t.name === e.target.value);
          if (selectedTheme) {
            setTheme(selectedTheme);
          }
        }}
      >
        {availableThemes.map(theme => (
          <option key={theme.name} value={theme.name}>
            {theme.name}
          </option>
        ))}
      </Select>
    </SelectorWrapper>
  );
};

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const SelectorLabel = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 8px 12px;
  font-family: ${({ theme }) => theme.fonts.body};
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  option {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;
