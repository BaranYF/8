// Main App component for Cinelist final project
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';

// API configuration  
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'f6ff3ea9c26a514dd9a6c390369cdec4';
const API_BASE = 'https://api.themoviedb.org/3';

function App() {
  // state management using React hooks
  const [currentUser, setCurrentUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [currentTab, setCurrentTab] = useState('discover');
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({ genre: '', year: '' });

  // load data when component mounts
  useEffect(() => {
    loadWatchlistFromStorage();
    loadPopularMovies();
    fetchGenres();
  }, []);

  // helper function to get year from date string
  const getYear = (dateString) => {
    if (!dateString) return 'Unknown';
    return dateString.split('-')[0];
  };

  // load popular movies on startup
  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/movie/popular?api_key=${API_KEY}`);
      const data = await response.json();
      const movies = data.results.map(movie => ({ ...movie, media_type: 'movie' }));
      setSearchResults(movies);
    } catch (error) {
      showDummyMovies();
    } finally {
      setLoading(false);
    }
  };

  // search for movies
  const searchMovies = async (query) => {
    if (!query.trim()) {
      showToast('Please enter something to search for', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      const movies = (data.results || []).map(movie => ({ ...movie, media_type: 'movie' }));
      setSearchResults(movies);
    } catch (error) {
      showToast('Search failed. Check your internet connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // fallback dummy movies if API fails
  const showDummyMovies = () => {
    const dummyMovies = [
      { id: 1, title: 'The Shawshank Redemption', media_type: 'movie', poster_path: null, release_date: '1994-09-23', vote_average: 9.3, overview: 'Two imprisoned men bond over a number of years...' },
      { id: 2, title: 'The Godfather', media_type: 'movie', poster_path: null, release_date: '1972-03-24', vote_average: 9.2, overview: 'The aging patriarch of an organized crime dynasty...' }
    ];
    setSearchResults(dummyMovies);
  };

  // fetch movie genres
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_BASE}/genre/movie/list?api_key=${API_KEY}`);
      const data = await response.json();
      setGenres(data.genres || []);
    } catch (error) {
      // continue without genres if API fails
    }
  };

  // toggle movie in watchlist
  const toggleWatchlist = (movieId) => {
    const movie = searchResults.find(m => m.id === movieId);
    if (!movie) return;

    const isInWatchlist = watchlist.some(w => w.id === movieId);
    let newWatchlist;

    if (isInWatchlist) {
      newWatchlist = watchlist.filter(w => w.id !== movieId);
      showToast('Removed from watchlist');
    } else {
      newWatchlist = [...watchlist, movie];
      showToast('Added to watchlist');
    }

    setWatchlist(newWatchlist);
    saveWatchlistToStorage(newWatchlist);
  };

  // localStorage functions
  const saveWatchlistToStorage = (list) => {
    try {
      localStorage.setItem('mediaNotesWatchlist', JSON.stringify(list));
    } catch (error) {
      // handle storage errors silently
    }
  };

  const loadWatchlistFromStorage = () => {
    try {
      const saved = localStorage.getItem('mediaNotesWatchlist');
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (error) {
      setWatchlist([]);
    }
  };

  // clear entire watchlist
  const clearWatchlist = () => {
    setWatchlist([]);
    saveWatchlistToStorage([]);
    showToast('Watchlist cleared');
    setShowProfileModal(false);
  };

  // handle Firebase logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      showToast('Logged out successfully');
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  // show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // filter movies based on selected filters
  const getFilteredMovies = () => {
    return searchResults.filter(item => {
      const matchesGenre = !filters.genre || (Array.isArray(item.genre_ids) && item.genre_ids.includes(Number(filters.genre)));
      const itemYear = getYear(item.release_date);
      const matchesYear = !filters.year || String(itemYear) === String(filters.year);
      return matchesGenre && matchesYear;
    });
  };

  return (
    <div className="app">
      <Header 
        currentUser={currentUser}
        watchlistCount={watchlist.length}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      <main>
        <SearchSection 
          onSearch={searchMovies}
          genres={genres}
          filters={filters}
          onFiltersChange={setFilters}
        />

        <MovieGrid 
          currentTab={currentTab}
          movies={currentTab === 'discover' ? getFilteredMovies() : watchlist}
          watchlist={watchlist}
          loading={loading}
          onMovieClick={setSelectedMovie}
          onToggleWatchlist={toggleWatchlist}
        />
      </main>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onLogin={setCurrentUser}
          onShowToast={showToast}
        />
      )}



      {toast.show && (
        <Toast 
          message={toast.message}
          type={toast.type}
        />
      )}

      <footer>
        <p>Movie data from TMDB API</p>
      </footer>
    </div>
  );
}

export default App;