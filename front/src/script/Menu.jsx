import '../css/Menu.css';

import menuIcon from '../assets/icons/menu.svg';
import arrowDownIcon from '../assets/icons/arrow-down.svg';
import newUserIcon from '../assets/icons/new-user.svg';
import newChatIcon from '../assets/icons/new-chat.svg';

import {useState} from "react";
import {useTranslation} from 'react-i18next';
// import { useInput } from "./InputContext.jsx";

function Menu({onHistoryToggle, onPromptOpen}) {
    const NamesOfNeuralNetworks = ['Deepseek V3', 'Microsoft Phi 4 Reasoning', 'Quen 3', 'InternVL3', 'Llama 3.3 Nemotron Super'];

    const {t} = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isVisibleAdduser, setIsVisibleAddUser] = useState(true);
    const [selectedText, setSelectedText] = useState(NamesOfNeuralNetworks[0]);
    // const { description } = useInput();

    // if (description != null && description.length > 0) {
    //     document.getElementsByClassName('params-action params-action-disable')[0].classList.replace('params-action-disable', 'params-action-active' );
    // }

    const handleItemClick = (index) => {
        setActiveIndex(index);
        setSelectedText(NamesOfNeuralNetworks[index]);
        setIsVisible(false); // Закрываем список после выбора
    };

    const handleAddUserClick = (e) => {
        e.preventDefault();
        setIsVisibleAddUser(!isVisibleAdduser);
    }

    const addUserID = (e) => {
        e.preventDefault();
        setIsVisibleAddUser(!isVisibleAdduser);
    }

    return (
        <div className="menu-group">
            <div className="container">
                {!isVisibleAdduser && <div className="bg-black-add-user" onClick={(e) => {
                    e.preventDefault();
                    setIsVisibleAddUser(!isVisibleAdduser)
                }}></div>}
                <div className="menu-group-history" onClick={onHistoryToggle}>
                    <img src={menuIcon} alt="История"/>
                </div>
                <div className="menu-group-params">
                    {!isVisibleAdduser && (<div className="user-add">
                        <input type="text" className="input-id-user" placeholder={t('menu.addUser.input')}/>
                        <div className="push-user-id">
                            <a href="#" onClick={addUserID}>{t('menu.addUser.add')}</a>
                        </div>
                    </div>)}
                    <a href="#" className="params-action params-action-disable">{t('menu.short')}</a>
                    <a href="#" className="params-action params-action-active">{t('menu.standard')}</a>
                    <a href="#" className="params-action params-action-disable">{t('menu.detail')}</a>
                    <a
                        href="#"
                        className="params-action params-action-active action-list"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsVisible(!isVisible);
                        }}
                    >
                        <div className="action-list-text">
                            {selectedText}
                        </div>
                        <img src={arrowDownIcon} alt="Стрелка"/>
                        {!isVisible && (<div className="list-items">
                                <ul>
                                    {NamesOfNeuralNetworks.map((name, index) => (
                                        <li
                                            key={index}
                                            className={`list-item ${index === activeIndex ? 'list-item-active' : ''}`}
                                            onClick={() => handleItemClick(index)}
                                        >
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </a>
                    <a href="#" className="params-action params-action-disable" onClick={onPromptOpen}>{t('menu.prompt')}</a>
                </div>
                <div className="menu-group-append">
                    <a href="#" className="append-user" onClick={handleAddUserClick}>
                        <img src={newUserIcon} alt="Добавить пользователя"/>
                    </a>
                    <a href="#" className="append-chat">
                        <img src={newChatIcon} alt="Новый чат"/>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Menu