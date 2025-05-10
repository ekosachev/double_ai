import "../css/HistoryDialogs.css";
import {useEffect} from 'react';

function HistoryDialogs({ isOpen, onClose }) {

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

    const NamesOfChats = {"10.05.2025":["Chat1", "Chat2"], "9.05.2025":["Chat3"] };

        return (
                <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
                    <div className="bg" onClick={handleClickOutside}></div>
                    <div className="bgHistory">
                        {Object.entries(NamesOfChats).map(([date, chats]) => (
                            <div key={date} className="history-date-group">
                                <div className="history-date">{date}</div>
                                {chats.map((chatName, index) => (
                                    <div
                                        key={`${date}-${index}`}
                                        className={`history-item`}
                                        onClick={onClose}
                                    >
                                        <a href="#">{chatName}</a>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
        )
}

export default HistoryDialogs