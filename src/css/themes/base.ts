// Base theme interface - this defines the structure all themes must follow
export interface ThemeInterface {
  name: string;
  colors: {
    // Primary brand colors
    primary: string;
    secondary: string;
    
    // Gray scale palette
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    
    // Semantic colors
    background: string;
    surface: string;
    border: string;
    
    // Status colors
    danger: string;
    success: string;
    info: string;
    warning: string;
    
    // Text colors
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
  };
  
  fonts: {
    body: string;
    heading?: string;
    mono?: string;
  };
  
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  
  // Future extensibility - any theme can add custom properties
  custom?: {
    [key: string]: any;
  };
}
