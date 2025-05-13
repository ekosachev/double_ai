import {createContext, useState, useContext} from 'react';
import {createDialogue, createBranch, createMessage} from './api/apiPostRequest.js';
import {getMessageById} from './api/apiGetRequests.js';

const DialogueContext = createContext();

export const DialogueProvider = ({children}) => {
    const [currentDialogue, setCurrentDialogue] = useState(null);
    const [currentBranch, setCurrentBranch] = useState(null);
    const [selectedModel, setSelectedModel] = useState('DeepSeek V3');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const startNewDialogue = async (model) => {
        try {
            setIsLoading(true);
            const dialogue = await createDialogue([{
                name: `Диалог ${new Date().toLocaleString()}`,
                model: model,
                creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
            }]);

            const branch = await createBranch([{
                dialogue_id: dialogue[0].id,
                name: 'Основная ветка',
                creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
            }]);

            setCurrentDialogue(dialogue);
            setCurrentBranch(branch);
            setMessages([]);
            return {dialogue, branch};
        } catch (error) {
            console.error('Ошибка создания диалога:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (messageText) => {
        if (!currentDialogue || !currentBranch) {
            await startNewDialogue(selectedModel);
        }

        try {
            setIsLoading(true);
            const newMessage = await createMessage([{
                user_message: messageText,
                model_response: '',
                branch_id: currentBranch[0].id,
                previous_message_id: messages.length > 0 ? messages[messages.length - 1].id : null,
                timestamp: new Date().toISOString()
            }]);

            setMessages(prev => [...prev, newMessage]);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const botResponse = await waitForBotResponse(newMessage.id);

            return botResponse;
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    const waitForBotResponse = async (messageId, attempts = 10, delay = 1000) => {
        for (let i = 0; i < attempts; i++) {
            try {
                const response = await getMessageById(messageId);

                if (response.model_response) {
                    return response;
                }
            } catch (error) {
                console.error(`Ошибка при получении сообщения ${messageId}:`, error);
            }

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        throw new Error('Не удалось получить ответ нейросети');
    };

    return (
        <DialogueContext.Provider value={{
            currentDialogue,
            currentBranch,
            messages,
            isLoading,
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