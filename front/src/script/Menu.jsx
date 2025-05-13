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
    const { selectedModel, setSelectedModel, startNewDialogue } = useDialogue();
    /*'DeepSeek V3',*/
    const availableModels = ['Microsoft Phi 4 Reasoning', 'Quen 3', 'InternVL3', 'Llama 3.3 Nemotron Super'];
    const [isModelListVisible, setIsModelListVisible] = useState(false);
    const [isAddUserVisible, setIsAddUserVisible] = useState(false);

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setIsModelListVisible(false);
    };

    const handleNewChat = async (e) => {
        e.preventDefault();
        try {
            await startNewDialogue(selectedModel);
        } catch (error) {
            console.error('Ошибка создания нового чата:', error);
        }
    };

    return (
        <div className="menu-group">
            <div className="container">
                {isAddUserVisible && (
                    <div className="bg-black-add-user" onClick={() => setIsAddUserVisible(false)}></div>
                )}

                <div className="menu-group-history" onClick={onHistoryToggle}>
                    <img src={menuIcon} alt="История"/>
                </div>

                <div className="menu-group-params">
                    {isAddUserVisible && (
                        <div className="user-add">
                            <input type="text" className="input-id-user" placeholder={t('menu.addUser.input')}/>
                            <div className="push-user-id">
                                <a href="#" onClick={() => setIsAddUserVisible(false)}>{t('menu.addUser.add')}</a>
                            </div>
                        </div>
                    )}

                    <a href="#" className="params-action params-action-disable">{t('menu.short')}</a>
                    <a href="#" className="params-action params-action-active">{t('menu.standard')}</a>
                    <a href="#" className="params-action params-action-disable">{t('menu.detail')}</a>

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