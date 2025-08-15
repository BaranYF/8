// React entry point for final project
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

// render the main App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
