// Individual movie card component
import React from 'react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie, isInWatchlist, onMovieClick, onToggleWatchlist }) {
  // helper function to get year from date
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return dateString.split('-')[0];
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation(); // prevent movie modal from opening
    onToggleWatchlist(movie.id);
  };

  const title = movie.title;
  const year = getYear(movie.release_date || movie.first_air_date);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div className="movie-card" onClick={() => onMovieClick(movie)}>
      <img 
        src={poster} 
        alt={title} 
        className="movie-poster" 
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
        }}
      />
      <button 
        className={`watchlist-btn ${isInWatchlist ? 'added' : ''}`}
        onClick={handleWatchlistClick}
      >
        {isInWatchlist ? 'remove' : 'add'}
      </button>
      <div className="movie-info">
        <div className="movie-title">{title}</div>
        <div className="movie-year">{year}</div>
        <div className="movie-rating">⭐ {rating}</div>
      </div>
    </div>
  );
}

export default MovieCard;
