import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

// Import and register the enhanced service worker
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Register service worker for enhanced caching
if (process.env.NODE_ENV === 'production') {
  serviceWorkerRegistration.register({
    onSuccess: () => {
      console.log('✅ Service worker registered successfully');
    },
    onUpdate: (registration) => {
      console.log('🔄 New service worker available. Applying update automatically...');

      // Automatically apply the update
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SKIP_WAITING'
        });

        // Listen for the new service worker to take control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('✅ Service worker updated successfully. Reloading page...');
          // Reload the page to use the new service worker
          window.location.reload();
        });
      }
    },
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
