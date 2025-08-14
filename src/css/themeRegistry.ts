import { ThemeInterface } from './themes/base';
import { defaultTheme } from './themes/default';

// Theme registry - add new themes here
export const themeRegistry: { [key: string]: ThemeInterface } = {
  default: defaultTheme,
  // Future themes will be added here:
  // dark: darkTheme,
  // colorful: colorfulTheme,
  // minimal: minimalTheme,
};

// Helper functions for theme management
export const getThemeByName = (name: string): ThemeInterface => {
  return themeRegistry[name] || defaultTheme;
};

export const getAllThemes = (): ThemeInterface[] => {
  return Object.values(themeRegistry);
};

export const registerTheme = (theme: ThemeInterface): void => {
  themeRegistry[theme.name.toLowerCase()] = theme;
};

// Get theme from localStorage or default
export const getInitialTheme = (): ThemeInterface => {
  const savedThemeName = localStorage.getItem('selectedTheme');
  if (savedThemeName) {
    return getThemeByName(savedThemeName.toLowerCase()) || defaultTheme;
  }
  return defaultTheme;
};
