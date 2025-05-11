import {useState} from 'react';
import '../css/index.css';
import Header from './Header.jsx';
import Menu from "./Menu.jsx";
import HistoryDialogs from './HistoryDialogs.jsx';
import Dialog from "./Dialog.jsx";

function App() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (<>
            <Header/>
            <Menu onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}/>
            <HistoryDialogs
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />
            <Dialog/>
        </>
    );
}

export default App;