// Movie grid component for displaying movies
import React from 'react';
import MovieCard from './MovieCard';

function MovieGrid({ currentTab, movies, watchlist, loading, onMovieClick, onToggleWatchlist }) {
  // helper function to get year from date
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return dateString.split('-')[0];
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>{currentTab === 'discover' ? 'Discover Movies' : 'My Watchlist'}</h2>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (currentTab === 'watchlist' && movies.length === 0) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>My Watchlist</h2>
          <p className="movie-count">0 movies in your watchlist</p>
        </div>
        <div className="empty-watchlist">
          <p>Your watchlist is empty!</p>
          <p>Start adding movies you want to watch.</p>
        </div>
      </div>
    );
  }

  if (currentTab === 'discover' && movies.length === 0) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2>Discover Movies</h2>
          <p className="movie-count">0 results</p>
        </div>
        <div className="no-results">
          <p>No movies found. Try different search terms!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>{currentTab === 'discover' ? 'Discover Movies' : 'My Watchlist'}</h2>
        <p className="movie-count">
          {movies.length} {currentTab === 'discover' ? 'results' : 'movies in your watchlist'}
        </p>
      </div>
      
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id}
            movie={movie}
            isInWatchlist={watchlist.some(w => w.id === movie.id)}
            onMovieClick={onMovieClick}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieGrid;
