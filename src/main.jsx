import './styles/global.css';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import DisableDevtool from 'disable-devtool';
import App from '@/application/App';

DisableDevtool({ md5: 'b750a6e2b3d860ae46efcc050e03db3b' });

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
);