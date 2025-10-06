import { useState, useCallback } from 'react';

interface ApiError {
  message: string;
  status?: number;
}

interface ApiErrorResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractErrorMessage = (err: any): string => {
    if (err?.response?.data) {
      const apiError = err.response.data as ApiErrorResponse;
      return apiError.error || apiError.message || 'Une erreur est survenue';
    }

    if (err?.message) {
      return err.message;
    }

    return 'Impossible de se connecter au serveur';
  };

  const handleApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: ApiError) => void
  ): Promise<T | null> => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await apiCall();
      setIsLoading(false);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (err: any) {
      const errorMessage = extractErrorMessage(err);
      const apiError: ApiError = {
        message: errorMessage,
        status: err?.response?.status || err.status
      };

      setError(apiError.message);
      setIsLoading(false);

      if (onError) {
        onError(apiError);
      }

      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError,   // ✅ on expose bien setError ici pour que Register.tsx puisse l'utiliser
    isLoading,
    handleApiCall,
    clearError
  };
};
