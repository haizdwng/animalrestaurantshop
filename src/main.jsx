import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import DisableDevtool from 'disable-devtool';
import App from '@/application/App';

DisableDevtool();

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);