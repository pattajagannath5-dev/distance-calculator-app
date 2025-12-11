import React, { useState, useEffect } from 'react';
import { getQueryHistory } from '../services/api';
import { useAddressSuggestions } from '../hooks/useAddressSuggestions';
import { useDistanceCalculation } from '../hooks/useDistanceCalculation';
import SuggestionsList from './SuggestionsList';
import '../styles/DistanceForm.css';

const DistanceForm = ({ onResultUpdate, onError }) => {
  const [address1, setAddress1] = useState('415 Mission St Suite 4800, San Francisco, CA 94105');
  const [address2, setAddress2] = useState('3223 Hanover St Suite 110, Palo Alto, CA 94304');
  const [unit, setUnit] = useState('both');
  const [validationError, setValidationError] = useState('');
  const [historicAddresses, setHistoricAddresses] = useState([]);

  const { result, loading, error, calculate, reset } = useDistanceCalculation();
  const {
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
  } = useAddressSuggestions(historicAddresses);

  useEffect(() => {
    fetchHistoricAddresses();
  }, []);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const fetchHistoricAddresses = async () => {
    try {
      const history = await getQueryHistory();
      const addresses = [...new Set(history.flatMap(q => [q.address1, q.address2]))];
      setHistoricAddresses(addresses);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const isSameAddress = () => address1.trim().toLowerCase() === address2.trim().toLowerCase();

  const handleAddress1InputChange = (e) => {
    const value = e.target.value;
    setAddress1(value);
    handleAddress1Change(value);
    validateAddresses(value, address2);
  };

  const handleAddress2InputChange = (e) => {
    const value = e.target.value;
    setAddress2(value);
    handleAddress2Change(value);
    validateAddresses(address1, value);
  };

  const validateAddresses = (addr1, addr2) => {
    if (addr1.trim().toLowerCase() === addr2.trim().toLowerCase() && addr2.trim()) {
      setValidationError('Source and destination addresses cannot be the same');
    } else {
      setValidationError('');
    }
  };

  const handleSelectSuggestion1 = (suggestion) => {
    const newAddress = selectSuggestion1(suggestion);
    setAddress1(newAddress);
    validateAddresses(newAddress, address2);
  };

  const handleSelectSuggestion2 = (suggestion) => {
    const newAddress = selectSuggestion2(suggestion);
    setAddress2(newAddress);
    validateAddresses(address1, newAddress);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSameAddress()) {
      setValidationError('Source and destination addresses cannot be the same');
      return;
    }

    const success = await calculate(address1, address2);
    if (success) {
      onResultUpdate(result);
      fetchHistoricAddresses();
    }
  };

  const handleClear = () => {
    setAddress1('');
    setAddress2('');
    setValidationError('');
    setShowSuggestions1(false);
    setShowSuggestions2(false);
    reset();
    onError('');
  };

  const displayDistance = () => {
    if (!result) return '—';
    if (unit === 'miles') return `${result.distance_miles} mi`;
    if (unit === 'kilometers') return `${result.distance_km} km`;
    return `${result.distance_miles} mi  ${result.distance_km} km`;
  };

  return (
    <form onSubmit={handleSubmit} className="distance-form">
      <div className="form-header">
        <div className="header-label">Source Address</div>
        <div className="header-label">Destination Address</div>
        <div className="header-label">Unit</div>
        <div className="header-label">Distance</div>
      </div>

      <div className="form-container">
        {/* Source Address Column */}
        <div className="form-column col-source">
          <div className="autocomplete-wrapper">
            <input
              type="text"
              value={address1}
              onChange={handleAddress1InputChange}
              onFocus={() => {
                if (suggestions1.length > 0) {
                  setShowSuggestions1(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions1(false), 200)}
              placeholder="Enter source address"
              required
            />
            {showSuggestions1 && suggestions1.length > 0 && (
              <SuggestionsList
                items={suggestions1}
                onSelect={handleSelectSuggestion1}
              />
            )}
          </div>
        </div>

        {/* Destination Address Column */}
        <div className="form-column col-destination">
          <div className="autocomplete-wrapper">
            <input
              type="text"
              value={address2}
              onChange={handleAddress2InputChange}
              onFocus={() => {
                if (suggestions2.length > 0) {
                  setShowSuggestions2(true);
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions2(false), 200)}
              placeholder="Enter destination address"
              required
            />
            {showSuggestions2 && suggestions2.length > 0 && (
              <SuggestionsList
                items={suggestions2}
                onSelect={handleSelectSuggestion2}
              />
            )}
          </div>
        </div>

        {/* Unit Column */}
        <div className="form-column col-unit">
          <div className="unit-section">
            {['miles', 'kilometers', 'both'].map(u => (
              <label key={u} className="radio-label">
                <input
                  type="radio"
                  value={u}
                  checked={unit === u}
                  onChange={(e) => setUnit(e.target.value)}
                />
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Distance Column */}
        <div className="form-column col-distance">
          <div className="distance-display">
            {displayDistance()}
          </div>
        </div>
      </div>

      {validationError && <div className="validation-error">{validationError}</div>}

      <div className="button-group">
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading || isSameAddress()}
        >
          {loading ? 'Calculating...' : 'Calculate Distance'}
        </button>
        <button type="button" className="btn-secondary" onClick={handleClear}>
          🗑️
        </button>
      </div>
    </form>
  );
};

export default DistanceForm;