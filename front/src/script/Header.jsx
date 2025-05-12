import '../css/Header.css'
import settingIcon from '../assets/icons/setting.svg';
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
        document.getElementsByClassName('action-group-languages')[0].classList.toggle('svg-fill-black');
        document.getElementsByClassName('action-group-languages-bg')[0].classList.toggle('action-group-languages-bg-2');
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
    };

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
                    <div className="action-group-languages-bg">
                        <a href="#" className="action-group-languages" onClick={handleLanguagesClick}>
                            {/*<img src={languageIcon} alt="Язык"/>*/}
                            <svg width="24" height="24" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_58_17)">
                                    <path
                                        d="M12 24C5.4 24 0 18.6 0 12C0 5.4 5.4 0 12 0C18.6 0 24 5.4 24 12C24 18.6 18.6 24 12 24ZM9.5 17C10.1 20.1 11.2 22 12 22C12.8 22 13.9 20.1 14.5 17H9.5ZM16.6 17C16.3 18.7 15.8 20.3 15.2 21.5C17.5 20.7 19.5 19.1 20.7 17H16.6ZM3.3 17C4.5 19.1 6.5 20.7 8.8 21.5C8.2 20.3 7.7 18.7 7.4 17H3.3ZM16.9 15H21.6C21.8 14.1 22 13 22 12C22 11 21.8 9.9 21.5 9H16.8C17 10 17 11 17 12C17 13 17 14 16.9 15ZM9.2 15H14.9C15 14.1 15.1 13.1 15.1 12C15.1 10.9 15 9.9 14.9 9H9.2C9.1 9.9 9 10.9 9 12C9 13.1 9.1 14.1 9.2 15ZM2.5 15H7.2C7.1 14 7.1 13 7.1 12C7.1 11 7.1 10 7.2 9H2.5C2.2 9.9 2 11 2 12C2 13 2.2 14.1 2.5 15ZM16.6 7H20.7C19.5 4.9 17.5 3.3 15.2 2.5C15.8 3.7 16.3 5.3 16.6 7ZM9.5 7H14.6C14 3.9 12.9 2 12.1 2C11.3 2 10.1 3.9 9.5 7ZM3.3 7H7.4C7.7 5.3 8.2 3.7 8.8 2.5C6.5 3.3 4.6 4.9 3.3 7Z"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_58_17">
                                        <rect width="24" height="24"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </div>
                    {!isVisible && (
                        <div className="languages-list-group">
                            <ul>
                                <li className="language">
                                    <a href="#">Русский</a>
                                </li>
                                <li className="language">
                                    <a href="#">English</a>
                                </li>
                            </ul>
                        </div>
                    )}
                    <a href="#" className="action-group-profile" onClick={handleProfileClick}>
                        {/*<div className="profile-text" id="profile-text">ЛВ</div>*/}
                        {user?.photo_url ? (<img src={user.photo_url} alt="Фото профиля"/>)
                            : (<div className="profile-text">
                                {user?.first_name?.[0]}
                                {user?.last_name?.[0]}
                            </div>)
                        }
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Header
