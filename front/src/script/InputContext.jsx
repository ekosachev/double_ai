import { createContext, useState, useContext } from 'react';

const InputContext = createContext();

export const InputProvider = ({ children }) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <InputContext.Provider value={{
            inputValue,
            setInputValue,
            isFocused,
            setIsFocused
        }}>
            {children}
        </InputContext.Provider>
    );
};

export const useInput = () => useContext(InputContext);