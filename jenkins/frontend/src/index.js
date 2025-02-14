import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
console.log('App version:', process.env.REACT_APP_VERSION);
root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);