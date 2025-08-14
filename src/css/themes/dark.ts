import { ThemeInterface } from './base';

// Example of a future dark theme
export const darkTheme: ThemeInterface = {
  name: 'Dark',
  
  colors: {
    // Primary brand colors - different for dark mode
    primary: 'hsl(220, 26%, 85%)',    // Light gray (inverted)
    secondary: 'hsl(158, 64%, 60%)',  // Brighter emerald green
    
    // Gray scale palette - inverted for dark mode
    gray: {
      50: 'hsl(222, 84%, 5%)',    // Nearly black (was 900)
      100: 'hsl(217, 33%, 12%)',  // Very dark gray
      200: 'hsl(215, 25%, 18%)',  // Dark gray
      300: 'hsl(215, 19%, 25%)',  // Medium dark gray
      400: 'hsl(215, 16%, 40%)',  // Medium gray
      500: 'hsl(215, 20%, 55%)',  // Medium gray
      600: 'hsl(213, 27%, 70%)',  // Medium light gray
      700: 'hsl(214, 32%, 80%)',  // Light gray
      800: 'hsl(210, 40%, 90%)',  // Very light gray
      900: 'hsl(210, 40%, 98%)',  // Nearly white (was 50)
    },
    
    // Semantic colors - dark mode variants
    background: 'hsl(222, 84%, 3%)',    // Very dark background
    surface: 'hsl(217, 33%, 8%)',       // Dark surface
    border: 'hsl(215, 25%, 18%)',       // Dark border
    
    // Status colors - slightly adjusted for dark mode
    danger: 'hsl(0, 84%, 65%)',         // Slightly brighter red
    success: 'hsl(158, 64%, 60%)',      // Brighter green
    info: 'hsl(217, 91%, 70%)',         // Brighter blue
    warning: 'hsl(38, 92%, 60%)',       // Brighter yellow
    
    // Text colors - inverted for dark mode
    text: {
      primary: 'hsl(210, 40%, 95%)',      // Light text
      secondary: 'hsl(215, 20%, 70%)',    // Medium light text
      muted: 'hsl(215, 16%, 50%)',        // Medium text
      inverse: 'hsl(222, 84%, 5%)',       // Dark text
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
    sm: '0 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 2px 8px rgba(0, 0, 0, 0.5)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.5)',
    xl: '0 8px 32px rgba(0, 0, 0, 0.6)',
  },
  
  transitions: {
    fast: '0.1s ease',
    normal: '0.2s ease',
    slow: '0.3s ease',
  },
  
  // Custom properties specific to dark theme
  custom: {
    isDark: true,
    glowEffects: {
      primary: '0 0 20px hsla(220, 26%, 85%, 0.3)',
      secondary: '0 0 20px hsla(158, 64%, 60%, 0.3)',
    }
  }
};
