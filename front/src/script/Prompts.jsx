import '../css/Prompts.css';
import backMainIcon from '../assets/icons/back-main.svg'
import arrowDownIcon from '../assets/icons/arrow-down.svg'
import translations from '../assets/json/prompt.json';
import {useInput} from "./InputContext.jsx";

import {useTranslation} from 'react-i18next';

function Prompts({isOpen, onClose}) {

    const {t, i18n} = useTranslation();
    const currentLanguage = i18n.language;
    const categories = translations[currentLanguage]?.category || {};
    const {setDescription} = useInput();

    const handleItemClick = (description) => {
        setDescription(description); // Теперь это вызовет перерендер
        onClose();
    };

    return (
        <div className={isOpen ? 'prompts-active' : 'prompts-disabled'}>
            <div className="container">
                <div className="prompt-header">
                    <h3>{t("prompts.header")}</h3>
                    <a href="#" className="back-icon" onClick={onClose}>
                        <img src={backMainIcon} alt="назад"/>
                    </a>
                </div>
                <div className="prompt-category">
                    <a href="#" className="prompts-list">
                        <div className="prompts-list-text">Все категории</div>
                        <img src={arrowDownIcon} alt=""/>
                    </a>
                </div>
                <div className="categories-container">
                    {Object.entries(categories).map(([categoryKey, categoryData]) => (
                        <div key={categoryKey} className="category-block">
                            <h2 className="category-title">{categoryData.title}</h2>

                            <div className="items-container">
                                {Object.entries(categoryData.items).map(([itemId, itemData]) => (
                                    <div
                                        key={itemId}
                                        className="item-card"
                                        onClick={() => {
                                            handleItemClick(itemData.description)
                                        }}
                                    >
                                        <div className="mini-name">{itemData['mini-name']}</div>
                                        <div className="description">{itemData.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Prompts