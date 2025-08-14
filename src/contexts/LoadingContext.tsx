import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

interface LoadingContextType {
  loadingState: LoadingState;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Loading...'
  });

  const showLoading = useCallback((message: string = 'Loading...') => {
    setLoadingState({
      isLoading: true,
      message
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false
    }));
  }, []);

  const setLoadingMessage = useCallback((message: string) => {
    setLoadingState(prev => ({
      ...prev,
      message
    }));
  }, []);

  return (
    <LoadingContext.Provider value={{
      loadingState,
      showLoading,
      hideLoading,
      setLoadingMessage
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  
  return {
    isLoading: context.loadingState.isLoading,
    loadingMessage: context.loadingState.message,
    showLoading: context.showLoading,
    hideLoading: context.hideLoading,
    setLoadingMessage: context.setLoadingMessage
  };
};
