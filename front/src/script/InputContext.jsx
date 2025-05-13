import { createContext, useState, useContext } from 'react';

const InputContext = createContext();

export const InputProvider = ({ children }) => {
    const [description, setDescription] = useState('');

    return (
        <InputContext.Provider value={{ description, setDescription }}>
            {children}
        </InputContext.Provider>
    );
};

export const useInput = () => useContext(InputContext);