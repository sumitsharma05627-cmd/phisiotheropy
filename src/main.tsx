import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { initPerformanceTracking } from './utils/performanceTracker';

// Prevent benign dev-environment HMR WebSocket closed rejections from popping up in error overlays
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    if (msg.includes('WebSocket closed without opened') || msg.includes('failed to connect to websocket')) {
      event.preventDefault();
    }
  });
}

// Initialize Core Web Vitals and load performance tracking
initPerformanceTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
