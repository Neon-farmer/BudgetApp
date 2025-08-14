import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeInterface } from './themes/base';
import { defaultTheme } from './themes/default';

interface ThemeContextType {
  currentTheme: ThemeInterface;
  setTheme: (theme: ThemeInterface) => void;
  availableThemes: ThemeInterface[];
  addTheme: (theme: ThemeInterface) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeInterface;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = defaultTheme 
}) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeInterface>(initialTheme);
  const [availableThemes, setAvailableThemes] = useState<ThemeInterface[]>([defaultTheme]);

  const setTheme = (theme: ThemeInterface) => {
    setCurrentTheme(theme);
    // Optionally save to localStorage for persistence
    localStorage.setItem('selectedTheme', theme.name);
  };

  const addTheme = (theme: ThemeInterface) => {
    setAvailableThemes(prev => {
      const exists = prev.find(t => t.name === theme.name);
      if (exists) {
        // Replace existing theme with same name
        return prev.map(t => t.name === theme.name ? theme : t);
      }
      return [...prev, theme];
    });
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes,
      addTheme
    }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
