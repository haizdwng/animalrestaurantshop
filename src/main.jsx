import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import DisableDevtool from 'disable-devtool';
import App from '@/application/App';

DisableDevtool();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);