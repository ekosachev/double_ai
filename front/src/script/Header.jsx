import '../css/Header.css'
import settingIcon from '../assets/icons/setting.svg';
import languageIcon from '../assets/icons/language.svg';
import {useEffect, useState} from "react";

function Header() {

    const [user, setUser] = useState(null);

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
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
    };

    console.log()

    return (
            <div className="header">
                <div className="container">
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
                        <a href="#" className="action-group-profile" onClick={handleProfileClick}>
                            <div className="profile-text" id="profile-text">ЛВ</div>
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default Header
