import "../css/HistoryDialogs.css";
import {useEffect} from 'react';

function HistoryDialogs({isOpen, onClose}) {

    const handleClickOutside = (e) => {
        if (e.target.classList.contains('bg')) {
            onClose();
        }
    };

    // Закрытие по Escape
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

    const NamesOfChats = {
        "10.05.2025": ["Chat1", "Chat2"],
        "9.05.2025": ["Chat3"],
        "1.03.2025": ["Chat4"],
        "11.05.2025": ["Chat5"],
        "1.05.2025": ["Chat6"],
        "20.04.2025": ["Chat7ggsdjgsjgslgslgndsljgnsljnsljnbsljnsljnbdljnfdjnflnjlnbdflnbdflbndflbglhgkekjdbkdjbhdkjbhfdjk"]
    };

// Функция для группировки дат
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

        // Преобразуем даты из строк в объекты Date и сортируем по убыванию
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

        for (const {date, dateStr, chats} of sortedEntries) {
            const diffTime = today - date;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                result["Сегодня"].push(...chats.map(chat => ({chat, dateStr})));
            } else if (diffDays === 1) {
                result["Вчера"].push(...chats.map(chat => ({chat, dateStr})));
            } else if (diffDays <= 7) {
                result["7 дней"].push(...chats.map(chat => ({chat, dateStr})));
            } else if (diffDays <= 14) {
                result["14 дней"].push(...chats.map(chat => ({chat, dateStr})));
            } else if (diffDays <= 30) {
                result["30 дней"].push(...chats.map(chat => ({chat, dateStr})));
            } else {
                const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!result["Более 30 дней"][yearMonth]) {
                    result["Более 30 дней"][yearMonth] = [];
                }
                result["Более 30 дней"][yearMonth].push(...chats.map(chat => ({chat, dateStr})));
            }
        }

        return result;
    };

    const groupedChats = groupDates(NamesOfChats);

    return (
        <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
            <div className="bg" onClick={handleClickOutside}></div>
            <div className="bgHistory">
                {/* Сегодня */}
                {groupedChats["Сегодня"].length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">Сегодня</div>
                        {groupedChats["Сегодня"].map(({chat}, index) => (
                            <div key={`today-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Вчера */}
                {groupedChats["Вчера"].length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">Вчера</div>
                        {groupedChats["Вчера"].map(({chat}, index) => (
                            <div key={`yesterday-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* 7 дней */}
                {groupedChats["7 дней"].length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">7 дней</div>
                        {groupedChats["7 дней"].map(({chat}, index) => (
                            <div key={`7days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* 14 дней */}
                {groupedChats["14 дней"].length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">14 дней</div>
                        {groupedChats["14 дней"].map(({chat}, index) => (
                            <div key={`14days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* 30 дней */}
                {groupedChats["30 дней"].length > 0 && (
                    <div className="history-date-group">
                        <div className="history-date">Последние 30 дней</div>
                        {groupedChats["30 дней"].map(({chat}, index) => (
                            <div key={`30days-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                )}

                {/* Более 30 дней (по месяцам) */}
                {Object.entries(groupedChats["Более 30 дней"]).map(([yearMonth, chats]) => (
                    <div key={yearMonth} className="history-date-group">
                        <div className="history-date">{yearMonth}</div>
                        {chats.map(({chat}, index) => (
                            <div key={`${yearMonth}-${index}`} className="history-item" onClick={onClose}>
                                <a href="#">{chat}</a>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistoryDialogs