// UI functions for filters and modal display

// initialize filter dropdowns
function initFilters() {
    const yearSelect = document.getElementById('year-select');
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= 1970; y--) {
            const opt = document.createElement('option');
            opt.value = String(y);
            opt.textContent = String(y);
            yearSelect.appendChild(opt);
        }
        yearSelect.addEventListener('change', function() {
            displaySearchResults();
        });
    }
    
    // setup genre filter
    const genreSelect = document.getElementById('genre-select');
    if (genreSelect) {
        populateGenres(genreSelect);
        genreSelect.addEventListener('change', function() {
            displaySearchResults();
        });
    }
}

// fetch movie genres from API
function populateGenres(selectEl) {
    const url = API_BASE + '/genre/movie/list?api_key=' + API_KEY;
    
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const genres = data.genres || [];
            genres.forEach(function(g) {
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = g.name;
                selectEl.appendChild(opt);
            });
        })
        .catch(function(error) {
            // if API fails, just continue without genres
        });
}

// show movie details in modal
function showMovieDetails(movieId) {
    const movie = searchResults.find(function(m) { return m.id === movieId; }) || 
                  watchlist.find(function(w) { return w.id === movieId; });
    if (!movie) return;
    
    const modal = document.getElementById('movie-modal');
    const details = document.getElementById('movie-details');
    const title = movie.title;
    const year = getYear(movie.release_date || movie.first_air_date);
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const poster = movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';
    const overview = movie.overview || 'No description available.';
    
    details.innerHTML = 
        '<div class="movie-detail-content">' +
            '<img src="' + poster + '" alt="' + title + '" class="detail-poster" onerror="this.src=\'https://via.placeholder.com/200x300?text=No+Image\'">' +
            '<div class="detail-info">' +
                '<h2>' + title + '</h2>' +
                '<p><strong>Year:</strong> ' + year + '</p>' +
                '<p><strong>Rating:</strong> ⭐ ' + rating + '</p>' +
                '<p><strong>Type:</strong> Movie</p>' +
                '<div class="detail-overview">' +
                    '<h3>Overview</h3>' +
                    '<p>' + overview + '</p>' +
                '</div>' +
            '</div>' +
        '</div>';
    modal.classList.remove('hidden');
}

// close modal function
function closeModal() {
    document.getElementById('movie-modal').classList.add('hidden');
}

// keyboard navigation - close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { 
        closeModal(); 
        closeAuthModal(); 
    }
});

// click outside modal to close
document.getElementById('movie-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('auth-modal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});

// show simple message to user
function showToast(message) {
    alert(message);
}

// update watchlist count in header
function bumpHeaderCount() {
    // simple function to update count display
    // could add animation later
}

