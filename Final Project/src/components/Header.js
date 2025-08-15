// Header component for navigation and user authentication
import React from 'react';

function Header({ currentUser, watchlistCount, currentTab, onTabChange, onAuthClick, onProfileClick, onLogout }) {
  return (
    <header>
      <div className="header-left">
        <h1>📽 Cinelist</h1>
      </div>
      
      <div className="header-center">
        <nav className="main-nav">
          <button 
            className={`nav-button ${currentTab === 'discover' ? 'active' : ''}`}
            onClick={() => onTabChange('discover')}
          >
            Discover
          </button>
          <button 
            className={`nav-button ${currentTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => onTabChange('watchlist')}
          >
            ❤️ Watchlist <span className="count">{watchlistCount}</span>
          </button>
        </nav>
      </div>
      
      <div className="header-right">
        <div className="auth-section">
          {!currentUser ? (
            <div className="auth-form compact-auth">
              <button onClick={onAuthClick}>login</button>
            </div>
          ) : (
            <div className="auth-form compact-auth">
              <button onClick={onLogout}>logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
