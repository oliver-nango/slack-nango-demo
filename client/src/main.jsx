import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Mount the React app into the single root element
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode helps catch unsafe patterns in development */}
    <App />
  </StrictMode>,
);
