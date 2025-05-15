import {createContext, useState, useContext} from 'react';
import {createDialogue, createBranch, createMessage} from './api/apiPostRequest.js';
import {
    getBranchesByDialogue, getDialogue,
    getDialogueById,
    getMessageById,
    getMessages
} from './api/apiGetRequests.js';

const DialogueContext = createContext();

export const DialogueProvider = ({children}) => {
    const [currentDialogue, setCurrentDialogue] = useState([]);
    const [currentBranch, setCurrentBranch] = useState([]);
    const [selectedModel, setSelectedModel] = useState('Quen 3');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState({});
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);


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
                previous_message_id: messages.length > 0 ? messages[messages.length - 1]?.id : null,
                timestamp: new Date().toISOString()
            }]);

            setMessages(prev => [...prev, {
                ...newMessage,
                model_response: '...'
            }]);

            const [botResponse] = await waitForBotResponse(newMessage.id);

            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id
                    ? botResponse
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

    const waitForBotResponse = async (messageId, maxAttempts = 2, delay = 1000) => {
        let attempts = 0;

        while (attempts < maxAttempts) {
            try {
                const response = await getMessageById(messageId);
                console.log(response)

                if (response?.model_response) {
                    return [response];
                }
            } catch (error) {
                console.warn(`Ошибка при получении сообщения (попытка ${attempts + 1}):`, error);
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        throw new Error(`Не удалось получить ответ после ${maxAttempts} попыток`);
    };

    const loadDialogue = async (dialogueId) => {
        try {
            setIsLoading(true);

            const dialogueResponse = await getDialogueById(dialogueId);
            if (!dialogueResponse) {
                throw new Error('Диалог не найден');
            }
            const dialogue = Array.isArray(dialogueResponse) ? dialogueResponse[0] : dialogueResponse;

            const branchesResponse = await getBranchesByDialogue(dialogueId);
            const branches = Array.isArray(branchesResponse) ? branchesResponse : [branchesResponse];

            if (!branches || branches.length === 0) {
                throw new Error('Ветки не найдены');
            }

            const mainBranch = branches.find(b => b?.name === 'Основная ветка') || branches[0];
            if (!mainBranch?.id) {
                throw new Error('Не удалось определить ветку');
            }

            const messagesResponse = await getMessages(mainBranch.id);
            const messages = Array.isArray(messagesResponse) ? messagesResponse : [messagesResponse];

            setCurrentDialogue([dialogue]);
            setCurrentBranch([mainBranch]);
            setMessages(messages);

            return {dialogue, branch: mainBranch, messages};

        } catch (error) {
            console.error('Ошибка загрузки диалога:', error);
            setCurrentDialogue([]);
            setCurrentBranch([]);
            setMessages([]);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchChatHistory = async () => {
        setIsHistoryLoading(true);
        try {
            const dialogues = await getDialogue();
            const historyData = {};

            await Promise.all(dialogues.map(async (dialogue) => {
                try {
                    const branches = await getBranchesByDialogue(dialogue.id);
                    const messages = await getMessageById(branches.id);
                    const firstMessageDate = new Date(messages.timestamp);
                    const dateKey = firstMessageDate.toLocaleDateString();

                    if (!historyData[dateKey]) {
                        historyData[dateKey] = [];
                    }

                    historyData[dateKey].push({
                        id: dialogue.id,
                        title: dialogue.name || `Диалог ${dialogue.id}`,
                        preview: messages.user_message,
                        date: firstMessageDate
                    });
                } catch (e) {
                    console.error(`Ошибка загрузки веток для диалога ${dialogue.id}:`, e);
                }
            }));

            Object.keys(historyData).forEach(date => {
                historyData[date].sort((a, b) => b.date - a.date);
            });
            setChatHistory(historyData);
        } catch (error) {
            console.error('Ошибка загрузки истории:', error);
            throw error;
        } finally {
            setIsHistoryLoading(false);
        }
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
            loadDialogue,
            setCurrentDialogue,
            setCurrentBranch,
            chatHistory,
            fetchChatHistory,
            isHistoryLoading
        }}>
            {children}
        </DialogueContext.Provider>
    );
};

export const useDialogue = () => useContext(DialogueContext);