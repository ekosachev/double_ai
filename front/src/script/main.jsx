import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '../css/index.css';
import App from './App';

if (window.Telegram?.WebApp?.expand) {
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.enableClosingConfirmation();
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>
);