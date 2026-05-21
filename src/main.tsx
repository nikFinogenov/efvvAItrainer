import * as ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppSettingsProvider } from './context/AppContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <AppSettingsProvider>
    <App />
  </AppSettingsProvider>
  // {/* </React.StrictMode>, */}
);