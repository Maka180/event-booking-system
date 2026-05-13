import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ResetPassword from './components/ResetPassword';
import './index.css';

const urlPath = window.location.pathname;
const isResetPassword = urlPath.startsWith('/reset-password/');
const resetToken = isResetPassword ? urlPath.split('/reset-password/')[1] : null;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isResetPassword ? <ResetPassword token={resetToken} /> : <App />}
  </React.StrictMode>
);