import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider'; // הוספנו סוגריים מסולסלים
import { ClientProvider } from './providers/ClientProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ClientProvider>
          <App />
        </ClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
