import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/main.scss'; // Main styling for the app
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
