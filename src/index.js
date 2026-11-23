import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apollo/cliente';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

async function enableMocking() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    const { worker } = await import('./mocks/browser');
    return await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${process.env.PUBLIC_URL || ''}/mockServiceWorker.js`,
      },
    });
  } catch (err) {
    console.warn('MSW no pudo registrarse como Service Worker, continuando:', err);
  }
}

enableMocking().then(() => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
