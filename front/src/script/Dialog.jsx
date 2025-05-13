import '../css/Dialog.css';

import arrowTop from '../assets/icons/arrow-top.svg';

function Dialog() {
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
                <input type="text" className="input-group-message" placeholder='Задать вопрос'/>
                <a className="input-group-send" onClick={}>
                    <img src={arrowTop} alt="Отправить"/>
                </a>
            </div>
        </div>
    )
}

export default Dialog;