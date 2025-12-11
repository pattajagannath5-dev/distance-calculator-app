import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/distance';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
const handleError = (error) => {
  if (error.response) {
    throw new Error(error.response.data?.detail || 'An error occurred');
  }
  throw error;
};

export const distanceAPI = {
  /**
   * Calculate distance between two addresses
   * @param {Object} data - { address1, address2 }
   * @returns {Promise<Object>} Distance calculation result
   */
  calculateDistance: async (data) => {
    try {
      const response = await apiClient.post('/calculate', data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Get all query history
   * @returns {Promise<Array>} List of past queries
   */
  getQueryHistory: async () => {
    try {
      const response = await apiClient.get('/history');
      return response.data.queries || [];
    } catch (error) {
      handleError(error);
    }
  },

  /**
   * Clear all query history
   * @returns {Promise<Object>} Success message
   */
  clearHistory: async () => {
    try {
      const response = await apiClient.delete('/history/clear');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

// Re-export for backward compatibility
export const calculateDistance = distanceAPI.calculateDistance;
export const getQueryHistory = distanceAPI.getQueryHistory;