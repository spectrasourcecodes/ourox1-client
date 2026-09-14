import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserAuthProvider } from './auth/userAuth';
import './styles/globals.css';
import ErrorBoundary from './components/ErrorBoundary';

// ✅ Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);

        // Check for updates periodically
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available – refresh or notify user
                  console.log('🔄 New content available; please refresh.');
                } else {
                  console.log('📦 Content cached for offline use.');
                }
              }
            };
          }
        };
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);