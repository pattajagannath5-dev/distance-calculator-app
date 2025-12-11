import React, { useState } from 'react';
import DistanceForm from '../components/DistanceForm';
import QueryHistory from '../components/QueryHistory';
import '../styles/Home.css';

const Home = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleResultUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setError('');
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Distance Calculator</h1>
            <p>Prototype web application for calculating the distance between addresses.</p>
          </div>
          <button className="history-btn" onClick={toggleHistoryView}>
            🕐 {showHistory ? 'Back to Calculator' : 'View Historical Queries'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {error && <div className="error-toast">{error}</div>}
        {showHistory ? (
          <QueryHistory refreshTrigger={refreshTrigger} />
        ) : (
          <DistanceForm onResultUpdate={handleResultUpdate} onError={handleError} />
        )}
      </main>
    </div>
  );
};

export default Home;