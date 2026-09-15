import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserAuthProvider } from './auth/userAuth';
import './styles/globals.css';

// ✅ ONLY register SW in production (Vite dev server + SW = removeChild errors)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration.scope);
      })
      .catch((error) => {
        console.error('❌ SW registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  </React.StrictMode>
);