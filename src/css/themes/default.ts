import { ThemeInterface } from './base';

export const defaultTheme: ThemeInterface = {
  name: 'Default',
  
  colors: {
    // Primary brand colors
    primary: 'hsl(220, 26%, 18%)',    // Dark gray
    secondary: 'hsl(158, 64%, 52%)',  // Emerald green
    
    // Gray scale palette
    gray: {
      50: 'hsl(210, 40%, 98%)',   // Very light gray
      100: 'hsl(210, 40%, 96%)',  // Light gray
      200: 'hsl(214, 32%, 91%)',  // Light gray
      300: 'hsl(213, 27%, 84%)',  // Medium light gray
      400: 'hsl(215, 20%, 65%)',  // Medium gray
      500: 'hsl(215, 16%, 47%)',  // Medium gray
      600: 'hsl(215, 19%, 35%)',  // Medium dark gray
      700: 'hsl(215, 25%, 27%)',  // Dark gray
      800: 'hsl(217, 33%, 17%)',  // Very dark gray
      900: 'hsl(222, 84%, 5%)',   // Nearly black
    },
    
    // Semantic colors
    background: 'hsl(0, 0%, 97%)',   // Light gray background
    surface: 'hsl(0, 0%, 100%)',     // White surface
    border: 'hsl(214, 32%, 91%)',    // Light border
    
    // Status colors
    danger: 'hsl(0, 84%, 60%)',      // Red for danger alerts
    success: 'hsla(158, 49%, 45%, 1.00)',   // Green for success messages
    info: 'hsl(217, 91%, 60%)',      // Blue for informational messages
    warning: 'hsl(38, 92%, 50%)',    // Yellow for warnings
    
    // Text colors
    text: {
      primary: 'hsl(220, 26%, 18%)',    // Dark text
      secondary: 'hsl(215, 16%, 47%)',  // Medium gray text
      muted: 'hsl(215, 20%, 65%)',      // Light gray text
      inverse: 'hsl(0, 0%, 100%)',      // White text
    }
  },
  
  fonts: {
    body: 'Arial, sans-serif',
    heading: 'Arial, sans-serif',
    mono: 'Consolas, Monaco, "Courier New", monospace',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 2px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.1)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
  
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },

  custom: { 'loading': 'orbital' }

};
