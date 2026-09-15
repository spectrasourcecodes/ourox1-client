import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserAuthProvider } from './auth/userAuth';
import './styles/globals.css';

const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        '/service-worker.js'
      );

      console.log(
        '✅ Service Worker registered:',
        registration.scope
      );

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (!newWorker) {
          return;
        }

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                '🔄 New version available.'
              );

              // Optional:
              // Show an "Update available" notification
              // instead of automatically reloading.
            } else {
              console.log(
                '📦 Application cached for offline use.'
              );
            }
          }
        });
      });
    } catch (error) {
      console.error(
        '❌ Service Worker registration failed:',
        error
      );
    }
  });
};

// registerServiceWorker();

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  </React.StrictMode>
);