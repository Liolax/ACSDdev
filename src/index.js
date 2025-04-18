import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.scss'; // Main styling for the app
import App from './App';
import reportWebVitals from './reportWebVitals';

// Main root creation and rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* App component encapsulates the entire application */}
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
// To log results, pass a function or use an analytics endpoint.
// Example: reportWebVitals(console.log)
// Learn more at: https://bit.ly/CRA-vitals
reportWebVitals();
