import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamic manifest & icon routing based on ?app query parameter
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const appParam = params.get('app')?.toLowerCase();
  const manifestLink = document.getElementById('app-manifest') as HTMLLinkElement | null;

  if (manifestLink) {
    if (appParam === 'buyer') {
      manifestLink.href = '/manifest-buyer.json';
      document.title = 'ManguDelivery - Buyer App';
    } else if (appParam === 'seller') {
      manifestLink.href = '/manifest-seller.json';
      document.title = 'ManguDelivery - Merchant Store';
    } else if (appParam === 'rider') {
      manifestLink.href = '/manifest-rider.json';
      document.title = 'ManguDelivery - Boda Rider';
    }
  }
}

createRoot(document.getElementById('root')!).render(<App />);
