import { useState, useCallback } from 'react';

/**
 * Custom hook for managing address autocomplete suggestions
 * @param {Array<string>} historicAddresses - List of previous addresses
 * @returns {Object} Suggestions state and handlers
 */
export const useAddressSuggestions = (historicAddresses) => {
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);

  const getFilteredSuggestions = useCallback((inputValue, allSuggestions) => {
    if (!inputValue.trim()) return [];
    
    const lowerInput = inputValue.toLowerCase();
    return allSuggestions.filter(address =>
      address.toLowerCase().includes(lowerInput)
    );
  }, []);

  const handleAddress1Change = useCallback((value) => {
    const filtered = getFilteredSuggestions(value, historicAddresses);
    setSuggestions1(filtered);
    setShowSuggestions1(filtered.length > 0);
  }, [historicAddresses, getFilteredSuggestions]);

  const handleAddress2Change = useCallback((value) => {
    const filtered = getFilteredSuggestions(value, historicAddresses);
    setSuggestions2(filtered);
    setShowSuggestions2(filtered.length > 0);
  }, [historicAddresses, getFilteredSuggestions]);

  const selectSuggestion1 = useCallback((suggestion) => {
    setSuggestions1([]);
    setShowSuggestions1(false);
    return suggestion;
  }, []);

  const selectSuggestion2 = useCallback((suggestion) => {
    setSuggestions2([]);
    setShowSuggestions2(false);
    return suggestion;
  }, []);

  return {
    suggestions1,
    suggestions2,
    showSuggestions1,
    showSuggestions2,
    setShowSuggestions1,
    setShowSuggestions2,
    handleAddress1Change,
    handleAddress2Change,
    selectSuggestion1,
    selectSuggestion2,
  };
};