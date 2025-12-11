import React from 'react';
import '../styles/SuggestionsList.css';

const SuggestionsList = ({ items, onSelect }) => {
  return (
    <ul className="suggestions-list">
      {items.map((item, index) => (
        <li
          key={index}
          onClick={() => onSelect(item)}
          className="suggestion-item"
        >
          📍 {item}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;