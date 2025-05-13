import '../css/Dialog.css';
import arrowTop from '../assets/icons/arrow-top.svg';
import {useTranslation} from 'react-i18next';
import {useDialogue} from './DialogueContext';
import {useInput} from './InputContext';
import {useEffect, useRef} from 'react';

function Dialog() {
    const {t} = useTranslation();
    const {messages, isLoading} = useDialogue();
    const {inputValue, setInputValue, isFocused, setIsFocused} = useInput();
    const {sendMessage} = useDialogue();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const handleSend = async () => {
        if (inputValue.trim()) {
            try {
                await sendMessage(inputValue);
                setInputValue('');
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='dialog'>
            <div className="dialog-chat">
                {messages.map((message, index) => (
                    <div key={index} className="dialog-message">
                        {message.user_message && (
                            <div className="message-user">{message.user_message}</div>
                        )}
                        {message.model_response && (
                            <div className="message-bot">
                                <div className="chat-neural-decoration">
                                    <img src="../../public/logo.svg" alt="Логотип"/>
                                    <div className="neural-decoration-text">Double AI</div>
                                </div>
                                <div className="chat-neural-text">{message.model_response}</div>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="message-bot">
                        <div className="chat-neural-decoration">
                            <img src="../../public/logo.svg" alt="Логотип"/>
                            <div className="neural-decoration-text">Double AI</div>
                        </div>
                        <div className="chat-neural-text loading-dots">Генерация ответа</div>
                    </div>
                )}
                <div ref={messagesEndRef}/>
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="dialog-message">*/}
                {/*    <p className="message-user">Тестовое сообщения*/}
                {/*        пользователя;*/}
                {/*    </p>*/}
                {/*    <div className="message-bot">*/}
                {/*        <div className="chat-neural-decoration">*/}
                {/*            <img src="../../public/logo.svg" alt="Логотип"/>*/}
                {/*            <div className="neural-decoration-text">Double AI</div>*/}
                {/*        </div>*/}
                {/*        <div className="chat-neural-text">Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*            Тестовое сообщение нейронки; Тестовое сообщение нейронки; Тестовое сообщение нейронки;*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div/>
            </div>

            <div className={`dialog-input-group ${isFocused ? 'focused' : ''}`}>
                <textarea
                    ref={inputRef}
                    className="input-group-message"
                    placeholder={t('dialog.input')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <button className="input-group-send"
                        onClick={handleSend}
                        disabled={isLoading}>
                    <img src={arrowTop} alt="Отправить"/>
                </button>
            </div>
        </div>
    );
}

export default Dialog;