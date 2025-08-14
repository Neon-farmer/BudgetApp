import React, { ComponentType, ReactElement } from 'react';
import { useAuthErrorHandler } from '../hooks/useAuthErrorHandler';

/**
 * Props for components wrapped with auth error handling
 */
interface WithAuthErrorHandlingProps {
  onAuthError?: (error: any) => void;
}

/**
 * Higher-order component that wraps components with automatic auth error handling
 * Any unhandled errors in the wrapped component will be checked for auth errors
 * and automatically redirect to login if needed
 */
export function withAuthErrorHandling<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithAuthErrorHandlingProps> {
  const WithAuthErrorHandlingComponent = (props: P & WithAuthErrorHandlingProps) => {
    const { handleError } = useAuthErrorHandler();
    const { onAuthError, ...componentProps } = props;

    // Create an error boundary-like effect
    React.useEffect(() => {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const wasHandled = handleError(event.reason, 'Unhandled promise rejection');
        if (wasHandled && onAuthError) {
          onAuthError(event.reason);
        }
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }, [handleError, onAuthError]);

    return <WrappedComponent {...(componentProps as P)} />;
  };

  WithAuthErrorHandlingComponent.displayName = `withAuthErrorHandling(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithAuthErrorHandlingComponent;
}

/**
 * Error Boundary component that specifically handles auth errors
 */
interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AuthErrorBoundary extends React.Component<
  React.PropsWithChildren<{ onAuthError?: (error: Error) => void }>,
  AuthErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{ onAuthError?: (error: Error) => void }>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    
    // Import the auth error handler dynamically to avoid circular dependencies
    import('../utils/authRedirect').then(({ handleAuthError }) => {
      const wasHandled = handleAuthError(error, 'React Error Boundary');
      if (wasHandled && this.props.onAuthError) {
        this.props.onAuthError(error);
      }
    });
  }

  render() {
    if (this.state.hasError) {
      // Return a fallback UI or null since we're likely redirecting
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>Redirecting to login...</p>
        </div>
      );
    }

    return this.props.children;
  }
}
