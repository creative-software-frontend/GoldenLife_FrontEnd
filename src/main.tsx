import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { GoldenLifeQueryProvider } from './providers/GoldenLifeQueryProvider';
import global_En from './translator/En/global.json';
import global_Bn from './translator/Bn/global.json';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

// 1. Import the Provider from react-redux


i18next.init({
  interpolation: { escapeValue: false },
  lng: 'en',
  resources: {
    en: {
      global: global_En,
    },
    bn: {
      global: global_Bn,
    },
  },
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* 3. Wrap everything inside the Redux Provider */}

      <I18nextProvider i18n={i18next}>
        <GoldenLifeQueryProvider>
          <App />
        </GoldenLifeQueryProvider>
      </I18nextProvider>

    </StrictMode>
  );
} else {
  console.error("Root element with ID 'root' not found.");
}