import '../css/Menu.css';
import menuIcon from '../assets/icons/menu.svg';
import arrowDownIcon from '../assets/icons/arrow-down.svg';
import newUserIcon from '../assets/icons/new-user.svg';
import newChatIcon from '../assets/icons/new-chat.svg';
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDialogue } from './DialogueContext';

function Menu({ onHistoryToggle, onPromptOpen }) {
    const { t } = useTranslation();
    const { selectedModel, setSelectedModel, setCurrentDialogue, setCurrentBranch, setMessages, fetchChatHistory, createNewChat, responseLength, setResponseLength} = useDialogue();
    const availableModels = ['Microsoft Phi 4 Reasoning', 'Quen 3', 'InternVL3', 'Llama 3.3 Nemotron Super'];
    const [isModelListVisible, setIsModelListVisible] = useState(false);
    const [isAddUserVisible, setIsAddUserVisible] = useState(false);

    const handleLengthSelect = (length) => {
        setResponseLength(length);
    };

    const getLengthButtonClass = (length) => {
        return `params-action ${responseLength === length ? 'params-action-active' : 'params-action-disable'}`;
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setIsModelListVisible(false);
    };

    const handleNewChat = async (e) => {
        e.preventDefault();
        try {
            setCurrentDialogue([]);
            setCurrentBranch([]);
            await createNewChat();
        } catch (error) {
            console.error('Ошибка создания нового чата:', error);
        }
    };

    const handleHistoryClick = async (e) => {
        e.preventDefault();
        try {
            onHistoryToggle();
            await fetchChatHistory();
        } catch (error) {
            console.error('Ошибка загрузки истории:', error);
        }
    };

    return (
        <div className="menu-group">
            <div className="container">
                {isAddUserVisible && (
                    <div className="bg-black-add-user" onClick={() => setIsAddUserVisible(false)}></div>
                )}

                <a href="#" className="menu-group-history" onClick={handleHistoryClick}>
                    <img src={menuIcon} alt="История"/>
                </a>

                <div className="menu-group-params">
                    {isAddUserVisible && (
                        <div className="user-add">
                            <input type="text" className="input-id-user" placeholder={t('menu.addUser.input')}/>
                            <div className="push-user-id">
                                <a href="#" onClick={() => setIsAddUserVisible(false)}>{t('menu.addUser.add')}</a>
                            </div>
                        </div>
                    )}

                    <a href="#"
                       className={getLengthButtonClass('short')}
                       onClick={(e) => {
                           e.preventDefault();
                           handleLengthSelect('short');
                       }}>
                        {t('menu.short')}
                    </a>

                    <a href="#"
                       className={getLengthButtonClass('standard')}
                       onClick={(e) => {
                           e.preventDefault();
                           handleLengthSelect('standard');
                       }}>
                        {t('menu.standard')}
                    </a>

                    <a href="#"
                       className={getLengthButtonClass('detail')}
                       onClick={(e) => {
                           e.preventDefault();
                           handleLengthSelect('detail');
                       }}>
                        {t('menu.detail')}
                    </a>

                    <a href="#" className="params-action params-action-active action-list"
                       onClick={(e) => {
                           e.preventDefault();
                           setIsModelListVisible(!isModelListVisible);
                       }}>
                        <div className="action-list-text">{selectedModel}</div>
                        <img src={arrowDownIcon} alt="Стрелка"/>
                        {isModelListVisible && (
                            <div className="list-items">
                                <ul>
                                    {availableModels.map((model, index) => (
                                        <li key={index}
                                            className={`list-item ${model === selectedModel ? 'list-item-active' : ''}`}
                                            onClick={() => handleModelSelect(model)}>
                                            {model}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </a>

                    <a href="#" className="params-action params-action-disable" onClick={onPromptOpen}>
                        {t('menu.prompt')}
                    </a>
                </div>

                <div className="menu-group-append">
                    <a href="#" className="append-user" onClick={() => setIsAddUserVisible(true)}>
                        <img src={newUserIcon} alt="Добавить пользователя"/>
                    </a>
                    <a href="#" className="append-chat" onClick={handleNewChat}>
                        <img src={newChatIcon} alt="Новый чат"/>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Menu;