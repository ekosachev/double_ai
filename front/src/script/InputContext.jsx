import { createContext, useState, useContext, useEffect } from 'react';
import { useDialogue } from './DialogueContext';

const InputContext = createContext();

export const InputProvider = ({ children }) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { sendMessage, currentDialogue } = useDialogue();

    // Очищаем поле ввода при смене диалога
    useEffect(() => {
        setInputValue('');
    }, [currentDialogue?.id]);

    const handleSend = async () => {
        if (inputValue.trim()) {
            try {
                await sendMessage(inputValue);
                setInputValue('');
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        }
    };

    return (
        <InputContext.Provider value={{
            inputValue,
            setInputValue,
            isFocused,
            setIsFocused,
            handleSend
        }}>
            {children}
        </InputContext.Provider>
    );
};

export const useInput = () => useContext(InputContext);