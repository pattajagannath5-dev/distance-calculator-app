import { useState, useCallback } from 'react';
import { calculateDistance } from '../services/api';

/**
 * Custom hook for distance calculation logic
 * @returns {Object} Calculation state and handlers
 */
export const useDistanceCalculation = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = useCallback(async (address1, address2) => {
    setLoading(true);
    setError('');

    try {
      const response = await calculateDistance({ address1, address2 });
      
      if (response.error) {
        setError(response.error);
        setResult(null);
        return false;
      }

      setResult(response);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Calculation failed';
      setError(errorMessage);
      setResult(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError('');
  }, []);

  return { result, loading, error, calculate, reset };
};