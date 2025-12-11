import React, { useState, useEffect } from 'react';
import { getQueryHistory, distanceAPI } from '../services/api';
import Pagination from './Pagination';
import '../styles/QueryHistory.css';

const QueryHistory = ({ refreshTrigger }) => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const history = await getQueryHistory();
      setQueries(history);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      try {
        await distanceAPI.clearHistory();
        setQueries([]);
        setCurrentPage(1);
        alert('History cleared successfully');
      } catch (err) {
        console.error('Error clearing history:', err);
        alert('Error clearing history');
      }
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(queries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueries = queries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of table
    const tableElement = document.querySelector('.table-wrapper');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="query-history-container">
      <div className="history-header">
        <div>
          <h2>Historical Queries</h2>
          <p>History of the user's queries.</p>
        </div>
        {queries.length > 0 && (
          <button className="clear-history-btn" onClick={handleClearHistory}>
            🗑️ Clear History
          </button>
        )}
      </div>

      {loading && queries.length === 0 ? (
        <div className="loading">Loading...</div>
      ) : queries.length === 0 ? (
        <div className="no-data">No queries yet. Calculate a distance to get started!</div>
      ) : (
        <>
          <div className="query-stats">
            <span className="stat-text">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, queries.length)} of {queries.length} queries
            </span>
          </div>

          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Source Address</th>
                  <th>Destination Address</th>
                  <th>Distance in Miles</th>
                  <th>Distance in Kilometers</th>
                </tr>
              </thead>
              <tbody>
                {currentQueries.map((q) => (
                  <tr key={q.id}>
                    <td>{q.address1}</td>
                    <td>{q.address2}</td>
                    <td>{q.distance_miles}</td>
                    <td>{q.distance_km}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QueryHistory;