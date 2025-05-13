import { createContext, useState, useContext } from 'react';
import { createDialogue, createBranch, createMessage } from './api/apiRequests.js';

const DialogueContext = createContext();

export const DialogueProvider = ({ children }) => {
    const [currentDialogue, setCurrentDialogue] = useState(null);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [selectedModel, setSelectedModel] = useState('Deepseek V3');
    const [messages, setMessages] = useState([]);

    const startNewDialogue = async (model) => {
        try {
            const dialogue = await createDialogue({
                name: `Диалог ${new Date().toLocaleString()}`,
                model,
                creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
            });

            const branch = await createBranch({
                dialogue_id: dialogue.id,
                name: 'Основная ветка',
                creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
            });

            setCurrentDialogue(dialogue);
            setCurrentBranch(branch);
            setMessages([]);
            return { dialogue, branch };
        } catch (error) {
            console.error('Ошибка создания диалога:', error);
            throw error;
        }
    };

    const sendMessage = async (messageText) => {
        if (!currentDialogue || !currentBranch) {
            await startNewDialogue(selectedModel);
        }

        try {
            const newMessage = await createMessage({
                user_message: messageText,
                branch_id: currentBranch.id,
                previous_message_id: messages.length > 0 ? messages[messages.length-1].id : null
            });

            setMessages([...messages, newMessage]);
            return newMessage;
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            throw error;
        }
    };

    return (
        <DialogueContext.Provider value={{
            currentDialogue,
            currentBranch,
            messages,
            selectedModel,
            setSelectedModel,
            startNewDialogue,
            sendMessage,
            setCurrentDialogue,
            setCurrentBranch
        }}>
            {children}
        </DialogueContext.Provider>
    );
};

export const useDialogue = () => useContext(DialogueContext);