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
        if (!currentDialogue[0] || !currentBranch[0]) {
            await startNewDialogue(selectedModel);
        }

        try {
            setIsLoading(true);

            const [newMessage] = await createMessage([{
                user_message: messageText,
                model_response: '',
                branch_id: currentBranch[0].id,
                previous_message_id: messages.length > 0 ? messages[messages.length - 1]?.id : null,
                timestamp: new Date().toISOString()
            }]);

            console.log('Отправленное сообщение:', newMessage);

            if (!newMessage?.id) {
                throw new Error('Неверный формат ответа сервера');
            }

            setMessages(prev => [...prev, {
                id: newMessage.id,
                user_message: messageText,
                model_response: '',
                timestamp: new Date().toISOString()
            }]);

            const [botResponse] = await waitForBotResponse(newMessage.id);
            console.log('Ответ нейросети:', botResponse);

            if (!botResponse?.model_response) {
                throw new Error('Пустой ответ от нейросети');
            }

            setMessages(prev => {
                const updated = [...prev];
                const lastMessage = updated[updated.length - 1];
                if (lastMessage.id === newMessage.id) {
                    updated[updated.length - 1] = {
                        ...lastMessage,
                        model_response: botResponse.model_response
                    };
                }
                return updated;
            });

            return botResponse;
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
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