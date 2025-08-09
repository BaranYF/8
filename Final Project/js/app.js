// Movie app for final project assignment
const API_KEY = 'f6ff3ea9c26a514dd9a6c390369cdec4';
const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// global variables for app state
let currentUser = null;
let searchResults = [];
let watchlist = [];
let currentTab = 'discover';

// helper function to get year from date string
function getYear(dateString) {
    if (!dateString) return 'Unknown';
    return dateString.split('-')[0];
}

function searchMovies() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert('Please enter something to search for');
        return;
    }
    
    // show loading and clear results
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('no-results').classList.add('hidden');
    
    // search for movies using API
    const url = API_BASE + '/search/movie?api_key=' + API_KEY + '&query=' + encodeURIComponent(query);
    
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            searchResults = (data.results || []).map(function(movie) {
                return { ...movie, media_type: 'movie' };
            });
            displaySearchResults();
        })
        .catch(function(error) {
            alert('Search failed. Check your internet connection.');
        })
        .finally(function() {
            document.getElementById('loading').classList.add('hidden');
        });
}

function loadPopularMovies() {
    const url = API_BASE + '/movie/popular?api_key=' + API_KEY;
    
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            searchResults = data.results.map(function(movie) {
                return { ...movie, media_type: 'movie' };
            });
            displaySearchResults();
        })
        .catch(function(error) {
            showDummyMovies();
        });
}

// fallback if api fails
function showDummyMovies() {
  searchResults = [
    { id: 1, title: 'The Shawshank Redemption', media_type: 'movie', poster_path: null, release_date: '1994-09-23', vote_average: 9.3, overview: 'Two imprisoned men bond over a number of years...' },
    { id: 2, title: 'The Godfather', media_type: 'movie', poster_path: null, release_date: '1972-03-24', vote_average: 9.2, overview: 'The aging patriarch of an organized crime dynasty...' }
  ];
  displaySearchResults();
}

// add/remove item from watchlist
// TODO: use Firebase instead of demo login
// TODO: set up webpack for modules

function toggleWatchlist(movieId) {
    const movie = searchResults.find(function(m) { return m.id === movieId; });
    if (!movie) return;
    
    const idx = watchlist.findIndex(function(w) { return w.id === movieId; });
    if (idx >= 0) {
        watchlist.splice(idx, 1);
        showToast('Removed from watchlist');
    } else {
        watchlist.push(movie);
        showToast('Added to watchlist');
    }
    
    saveWatchlistToStorage();
    if (currentTab === 'discover') displaySearchResults(); 
    else displayWatchlist();
    updateWatchlistCount();
    bumpHeaderCount();
}

// render discover results
function displaySearchResults() {
  const container = document.getElementById('search-results');
  const noResults = document.getElementById('no-results');
  const genreFilter = document.getElementById('genre-select')?.value || '';
  const yearFilter = document.getElementById('year-select')?.value || '';
  const filtered = searchResults.filter(item => {
    const matchesGenre = !genreFilter || (Array.isArray(item.genre_ids) && item.genre_ids.includes(Number(genreFilter)));
    const itemYear = getYear(item.release_date);
    const matchesYear = !yearFilter || String(itemYear) === String(yearFilter);
    return matchesGenre && matchesYear;
  });
  const countEl = document.getElementById('discover-film-count');
  if (countEl) countEl.textContent = `${filtered.length} results`;
  if (filtered.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');
  let html = '';
  filtered.forEach(item => {
    const title = item.title;
    const year = getYear(item.release_date || item.first_air_date);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const poster = item.poster_path ? IMG_BASE + item.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';
    const isInWatchlist = watchlist.some(w => w.id === item.id);
    const watchlistText = isInWatchlist ? 'remove' : 'add';
    const watchlistClass = isInWatchlist ? 'added' : '';
    html += `
      <div class="movie-card" onclick="showMovieDetails(${item.id})">
        <img src="${poster}" alt="${title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <button class="watchlist-btn ${watchlistClass}" onclick="event.stopPropagation(); toggleWatchlist(${item.id})">${watchlistText}</button>
        <div class="movie-info">
          <div class="movie-title">${title}</div>
          <div class="movie-year">${year}</div>
          <div class="movie-rating">⭐ ${rating}</div>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

// render watchlist screen
function displayWatchlist() {
  const container = document.getElementById('watchlist-grid');
  const empty = document.getElementById('empty-watchlist');
  updateWatchlistCount();
  if (watchlist.length === 0) {
    container.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  let html = '';
  watchlist.forEach(item => {
    const title = item.title;
    const year = getYear(item.release_date || item.first_air_date);
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const poster = item.poster_path ? IMG_BASE + item.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';
    html += `
      <div class="movie-card" onclick="showMovieDetails(${item.id})">
        <img src="${poster}" alt="${title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
        <button class="watchlist-btn added" onclick="event.stopPropagation(); toggleWatchlist(${item.id})">remove</button>
        <div class="movie-info">
          <div class="movie-title">${title}</div>
          <div class="movie-year">${year}</div>
          <div class="movie-rating">⭐ ${rating}</div>
        </div>
      </div>`;
  });
  container.innerHTML = html;
}

// update counts on discover + header
function updateWatchlistCount() {
  const count = watchlist.length;
  document.getElementById('watchlist-count').textContent = `${count} films in your watchlist`;
  document.getElementById('header-watchlist-count').textContent = count;
}

// simple localStorage save/load
function saveWatchlistToStorage() {
  try { localStorage.setItem('mediaNotesWatchlist', JSON.stringify(watchlist)); } catch {}
}
function loadWatchlistFromStorage() {
  try {
    const saved = localStorage.getItem('mediaNotesWatchlist');
    if (saved) { watchlist = JSON.parse(saved); updateWatchlistCount(); }
  } catch { watchlist = []; }
}

