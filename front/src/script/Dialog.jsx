import '../css/Dialog.css';
import {useInput} from "./InputContext.jsx";
import arrowTop from '../assets/icons/arrow-top.svg';

import {useTranslation} from 'react-i18next';

function Dialog() {

    const {t} = useTranslation();
    const {description} = useInput();
    const inputElement = document.querySelector('.input-group-message');
    if (inputElement) {
        inputElement.value = description;
    }

    return (
        <div className='dialog'>
            <div className="dialog-chat">
                <div className="dialog-chat-neural">
                    <div className="chat-neural-decoration">
                        <img src="../../public/logo.svg" alt="Логотип"/>
                        <div className="neural-decoration-text">Double AI</div>
                    </div>
                    <div className="chat-neural-text"></div>
                </div>
            </div>
            <div className="dialog-input-group">
                <input type="text" className="input-group-message" placeholder={t('dialog.input')}/>
                <a className="input-group-send">
                    <img src={arrowTop} alt="Отправить"/>
                </a>
            </div>
        </div>
    )
}

export default Dialog;