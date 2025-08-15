// Search section component with filters
import React, { useState, useEffect } from 'react';

function SearchSection({ onSearch, genres, filters, onFiltersChange }) {
  const [searchQuery, setSearchQuery] = useState('');

  // generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1970; y--) {
      years.push(y);
    }
    return years;
  };

  // handle search
  const handleSearch = () => {
    onSearch(searchQuery);
  };

  // handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // handle filter changes
  const handleFilterChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-container">
          <input 
            type="text" 
            id="search-input"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-icon" onClick={handleSearch}>🔍</button>
        </div>
      </div>
      
      <div className="filters">
        <select 
          className="filter-select" 
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
          aria-label="Filter by genre"
        >
          <option value="">Any Genre</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        
        <select 
          className="filter-select"
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          aria-label="Filter by year"
        >
          <option value="">Any Year</option>
          {generateYearOptions().map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchSection;
