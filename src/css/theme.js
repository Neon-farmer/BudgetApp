// Legacy theme.js - maintained for backward compatibility
// New theme system is in themes/ directory and ThemeProvider.tsx

import { defaultTheme } from './themes/default';

// Export the default theme for existing components
export const theme = defaultTheme;

// Re-export theme utilities for easier imports
export { defaultTheme } from './themes/default';
export { ThemeProvider, useTheme } from './ThemeProvider';
export { 
  themeRegistry, 
  getThemeByName, 
  getAllThemes, 
  registerTheme, 
  getInitialTheme 
} from './themeRegistry';
