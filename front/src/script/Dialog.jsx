import '../css/Dialog.css';

import arrowTop from '../assets/icons/arrow-top.svg';

function Dialog() {
    return (
        <div className='dialog'>
            <div className="dialog-chat"></div>
            <div className="dialog-input-group">
                <input type="text" className="input-group-message" placeholder='Задать вопрос'/>
                <a className="input-group-send">
                    <img src={arrowTop} alt="Отправить"/>
                </a>
            </div>
        </div>
    )
}

export default Dialog;