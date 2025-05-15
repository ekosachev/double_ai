import {useState} from 'react';
import {I18nextProvider} from 'react-i18next';
import '../css/index.css';
import Header from './Header.jsx';
import Menu from "./Menu.jsx";
import HistoryDialogs from './HistoryDialogs.jsx';
import Dialog from "./Dialog.jsx";
import Prompts from "./Prompts.jsx";
import i18n from "./i18n.jsx";
import {InputProvider} from './InputContext.jsx';
import {DialogueProvider} from './DialogueContext.jsx';

function App() {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isPromptOpen, setIsPromptOpen] = useState(false);

    return (<>
            <I18nextProvider i18n={i18n}>
                <DialogueProvider>
                    <InputProvider>
                        <Header/>
                        <Menu
                            onHistoryToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                            onPromptOpen={() => setIsPromptOpen(!isPromptOpen)}
                        />
                        <HistoryDialogs
                            isOpen={isHistoryOpen}
                            onClose={() => setIsHistoryOpen(false)}
                        />
                        <Dialog/>
                        <Prompts
                            isOpen={isPromptOpen}
                            onClose={() => setIsPromptOpen(false)}
                        />
                    </InputProvider>
                </DialogueProvider>
            </I18nextProvider>
        </>
    );
}

export default App;