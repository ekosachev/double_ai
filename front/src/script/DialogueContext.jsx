import {createContext, useState, useContext} from 'react';
import {createDialogue, createBranch, createMessage} from './api/apiPostRequest.js';
import {getMessageById} from './api/apiGetRequests.js';

const DialogueContext = createContext();

export const DialogueProvider = ({children}) => {
    const [currentDialogue, setCurrentDialogue] = useState([]);
    const [currentBranch, setCurrentBranch] = useState([]);
    const [selectedModel, setSelectedModel] = useState('DeepSeek V3');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    const sendMessage = async (messageText) => {
        if (!messageText.trim()) return null;

        try {
            setIsLoading(true);

            let branchId;
            let newDialogue, newBranch;

            if (!currentDialogue[0] || !currentBranch[0]) {
                [newDialogue] = await createDialogue([{
                    name: `Диалог ${new Date().toLocaleString()}`,
                    model: selectedModel,
                    creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
                }]);

                [newBranch] = await createBranch([{
                    dialogue_id: newDialogue.id,
                    name: 'Основная ветка',
                    creator: window.Telegram.WebApp.initDataUnsafe.user?.id || 'anonymous'
                }]);

                setCurrentDialogue([newDialogue]);
                setCurrentBranch([newBranch]);
                branchId = newBranch.id;
            } else {
                branchId = currentBranch[0].id;
            }

            const [newMessage] = await createMessage([{
                user_message: messageText,
                model_response: '',
                branch_id: branchId,
                previous_message_id: messages.length > 0 ? messages[messages.length-1]?.id : null,
                timestamp: new Date().toISOString()
            }]);

            setMessages(prev => [...prev, newMessage]);

            const [botResponse] = await waitForBotResponse(newMessage.id);

            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id
                    ? { ...msg, model_response: botResponse.model_response }
                    : msg
            ));

            return {
                dialogue: newDialogue || currentDialogue[0],
                branch: newBranch || currentBranch[0],
                message: newMessage,
                botResponse
            };

        } catch (error) {
            console.error('Ошибка отправки:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const waitForBotResponse = async (messageId, attempts = 20, delay = 1000) => {
        for (let i = 0; i < attempts; i++) {
            try {
                const [response] = await getMessageById(messageId);
                console.log(`Попытка ${i+1}:`, response); // Логируем процесс

                if (response?.model_response) {
                    return [response];
                }
            } catch (error) {
                console.warn(`Ошибка при получении сообщения:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        throw new Error(`Не удалось получить ответ за ${attempts} попыток`);
    };

    return (
        <DialogueContext.Provider value={{
            currentDialogue,
            currentBranch,
            messages,
            isLoading,
            selectedModel,
            setSelectedModel,
            sendMessage,
            setCurrentDialogue,
            setCurrentBranch
        }}>
            {children}
        </DialogueContext.Provider>
    );
};

export const useDialogue = () => useContext(DialogueContext);