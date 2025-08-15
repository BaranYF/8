// Movie detail modal component
import React, { useEffect } from 'react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieModal({ movie, onClose }) {
  // helper function to get year from date
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return dateString.split('-')[0];
  };

  // close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const title = movie.title;
  const year = getYear(movie.release_date || movie.first_air_date);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';
  const overview = movie.overview || 'No description available.';

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <div className="movie-detail-content">
          <img 
            src={poster} 
            alt={title} 
            className="detail-poster" 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
            }}
          />
          <div className="detail-info">
            <h2>{title}</h2>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Rating:</strong> ⭐ {rating}</p>
            <p><strong>Type:</strong> Movie</p>
            <div className="detail-overview">
              <h3>Overview</h3>
              <p>{overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
