import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/index.css';
import Header from './Header.jsx';
import Menu from "./Menu.jsx";
import HistoryDialogs from './HistoryDialogs.jsx';

function App() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <StrictMode>
            <Header />
            <Menu onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)} />
            <HistoryDialogs
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(<App />);