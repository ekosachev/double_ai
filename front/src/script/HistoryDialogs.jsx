import "../css/HistoryDialogs.css";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDialogue, getMessages} from './api/apiRequests.js';

function HistoryDialogs({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [chatHistory, setChatHistory] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && !isLoading && Object.keys(chatHistory).length === 0) {
            fetchChatHistory();
        }
    }, [isOpen]);

    const fetchChatHistory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const dialogues = await getDialogue();
            const historyData = {};

            await Promise.all(dialogues.map(async (dialogue) => {
                try {
                    const messages = await getMessages(dialogue.id);
                    if (messages.length > 0) {
                        const firstMessageDate = new Date(messages[0].timestamp);
                        const dateKey = `${firstMessageDate.getDate()}.${firstMessageDate.getMonth() + 1}.${firstMessageDate.getFullYear()}`;

                        const chatName = messages[0].user_message || dialogue.name || `Диалог ${dialogue.id}`;

                        if (!historyData[dateKey]) {
                            historyData[dateKey] = [];
                        }

                        historyData[dateKey].push(chatName);
                    }
                } catch (e) {
                    console.error(`Ошибка загрузки сообщений для диалога ${dialogue.id}:`, e);
                }
            }));

            setChatHistory(historyData);
        } catch (err) {
            console.error('Ошибка загрузки истории чатов:', err);
            setError(t('history.load_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('bg')) {
            onClose();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const groupDates = (datesObj) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = {
            "Сегодня": [],
            "Вчера": [],
            "7 дней": [],
            "14 дней": [],
            "30 дней": [],
            "Более 30 дней": {}
        };

        const sortedEntries = Object.entries(datesObj)
            .map(([dateStr, chats]) => {
                const [day, month, year] = dateStr.split('.').map(Number);
                return {
                    date: new Date(year, month - 1, day),
                    dateStr,
                    chats
                };
            })
            .sort((a, b) => b.date - a.date);

        for (const { date, dateStr, chats } of sortedEntries) {
            const diffTime = today - date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                result["Сегодня"].push(...chats.map(chat => ({ chat, dateStr })));
            } else if (diffDays === 1) {
                result["Вчера"].push(...chats.map(chat => ({ chat, dateStr })));
            } else if (diffDays <= 7) {
                result["7 дней"].push(...chats.map(chat => ({ chat, dateStr })));
            } else if (diffDays <= 14) {
                result["14 дней"].push(...chats.map(chat => ({ chat, dateStr })));
            } else if (diffDays <= 30) {
                result["30 дней"].push(...chats.map(chat => ({ chat, dateStr })));
            } else {
                const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!result["Более 30 дней"][yearMonth]) {
                    result["Более 30 дней"][yearMonth] = [];
                }
                result["Более 30 дней"][yearMonth].push(...chats.map(chat => ({ chat, dateStr })));
            }
        }

        return result;
    };

    const groupedChats = groupDates(chatHistory);

    if (isLoading) {
        return (
            <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
                <div className="bg" onClick={handleClickOutside}></div>
                <div className="bgHistory">
                    <div className="loading">{t('history.loading')}</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
                <div className="bg" onClick={handleClickOutside}></div>
                <div className="bgHistory">
                    <div className="error">{error}</div>
                    <button onClick={fetchChatHistory}>{t('history.retry')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
            <div className="bg" onClick={handleClickOutside}></div>
            <div className="bgHistory">
                {groupedChats["Сегодня"]?.length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">{t('history.today')}</div>
                        {groupedChats["Сегодня"].map(({ chat }, index) => (
                            <div key={`today-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {groupedChats["Вчера"]?.length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">{t('history.yesterday')}</div>
                        {groupedChats["Вчера"].map(({ chat }, index) => (
                            <div key={`yesterday-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {groupedChats["7 дней"]?.length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">{t('history.week')}</div>
                        {groupedChats["7 дней"].map(({ chat }, index) => (
                            <div key={`7days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {groupedChats["14 дней"]?.length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">{t('history.2week')}</div>
                        {groupedChats["14 дней"].map(({ chat }, index) => (
                            <div key={`14days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {groupedChats["30 дней"]?.length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">{t('history.month')}</div>
                        {groupedChats["30 дней"].map(({ chat }, index) => (
                            <div key={`30days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {Object.entries(groupedChats["Более 30 дней"] || {}).map(([yearMonth, chats]) => (
                    <div key={yearMonth} className="history-date-group">
                        <div className="history-date">{yearMonth}</div>
                        {chats.map(({ chat }, index) => (
                            <div key={`${yearMonth}-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoryDialogs;