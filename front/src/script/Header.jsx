import '../css/Header.css'
import settingIcon from '../assets/icons/setting.svg';
import languageIcon from '../assets/icons/language.svg';
import {useEffect, useState} from "react";

function Header() {

    const [user, setUser] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            setUser(window.Telegram.WebApp.initDataUnsafe.user);
        }
    }, []);

    const handleSettingsClick = (e) => {
        e.preventDefault();
    };

    const handleLanguagesClick = (e) => {
        e.preventDefault();
        setIsVisible(!isVisible);
        document.getElementsByClassName('bg-black')[0].classList.toggle('bg-black-color');
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
    };

    console.log()

    return (
        <div className="header">
            <div className="container">
                <div className="bg-black"></div>
                <div className="header-logo-group">
                    <img src="../../public/logo.svg" alt="Логотип" className="logo-group-image"/>
                    <div className="logo-group-text">Double AI</div>
                </div>
                <div className="header-action-group">
                    <a href="#" className="action-group-setting" onClick={handleSettingsClick}>
                        <img src={settingIcon} alt="Настройки"/>
                    </a>
                    <a href="#" className="action-group-languages" onClick={handleLanguagesClick}>
                        <img src={languageIcon} alt="Язык"/>
                    </a>
                    {!isVisible && (
                        <div className="languages-list-group">
                            <ul>
                                <li className="language">Русский</li>
                                <li className="language">English</li>
                            </ul>
                        </div>
                    )}
                    <a href="#" className="action-group-profile" onClick={handleProfileClick}>
                        <div className="profile-text" id="profile-text">ЛВ</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Header
