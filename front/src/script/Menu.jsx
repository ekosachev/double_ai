import '../css/Menu.css';

import menuIcon from '../assets/icons/menu.svg';
import arrowDownIcon from '../assets/icons/arrow-down.svg';
import newUserIcon from '../assets/icons/new-user.svg';
import newChatIcon from '../assets/icons/new-chat.svg';

import {useState} from "react";

function Menu({onHistoryToggle}) {
    const NamesOfNeuralNetworks = ['Deepseek V3', 'Microsoft Phi 4 Reasoning', 'Quen 3', 'InternVL3', 'Llama 3.3 Nemotron Super'];


    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [selectedText, setSelectedText] = useState(NamesOfNeuralNetworks[0]);

    const handleItemClick = (index) => {
        setActiveIndex(index);
        setSelectedText(NamesOfNeuralNetworks[index]);
        setIsVisible(false); // Закрываем список после выбора
    };

    return (
        <div className="menu-group">
            <div className="container">
                <div className="menu-group-history" onClick={onHistoryToggle}>
                    <img src={menuIcon} alt="История"/>
                </div>
                <div className="menu-group-params">
                    <a href="#" className="params-action params-action-disable">Короче</a>
                    <a href="#" className="params-action params-action-active">Стандартно</a>
                    <a href="#" className="params-action params-action-disable">Подробнее</a>
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
                    <a href="#" className="params-action params-action-disable">Промт</a>
                </div>
                <div className="menu-group-append">
                    <a href="#" className="append-user">
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