// Entry point for React app - assignment 3
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';

// render the main App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);