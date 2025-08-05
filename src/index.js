import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // <-- Imports the global styles
import App from './App';
import { AuthProvider } from './context/AuthContext';

// The "as HTMLElement" has been removed here
const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);