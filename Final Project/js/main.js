// main initialization when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadWatchlistFromStorage();
    initFilters();
    showDiscover();
    loadPopularMovies();
    
    // add enter key support for search
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchMovies();
    });
});

// function to show discover tab
function showDiscover() {
    document.getElementById('discover-section').classList.remove('hidden');
    document.getElementById('watchlist-section').classList.add('hidden');
    document.getElementById('discover-btn').classList.add('active');
    document.getElementById('watchlist-btn').classList.remove('active');
    currentTab = 'discover';
}

// function to show watchlist tab
function showWatchlist() {
    document.getElementById('discover-section').classList.add('hidden');
    document.getElementById('watchlist-section').classList.remove('hidden');
    document.getElementById('discover-btn').classList.remove('active');
    document.getElementById('watchlist-btn').classList.add('active');
    currentTab = 'watchlist';
    displayWatchlist();
}

