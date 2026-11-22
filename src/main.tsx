import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  if (
    path === '/results' ||
    path.startsWith('/results/') ||
    params.get('section') === 'results' ||
    window.location.hash === '#results'
  ) {
    window.history.replaceState(null, '', '/');
  }
}

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration is optional (e.g. restricted iframe contexts)
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

