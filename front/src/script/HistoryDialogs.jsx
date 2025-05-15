import "../css/HistoryDialogs.css";
import { useTranslation } from 'react-i18next';
import { useDialogue } from "./DialogueContext.jsx";

function HistoryDialogs({ isOpen, onClose }) {
    const { t } = useTranslation();
    const { chatHistory, isHistoryLoading, loadDialogue } = useDialogue();

    const handleChatSelect = async (dialogueId) => {
        try {
            console.log('1')
            await loadDialogue(dialogueId);
            onClose();
        } catch (error) {
            console.error('Ошибка загрузки чата:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={isOpen ? 'active-history-list' : 'disable-history-list'}>
            <div className="bg" onClick={onClose}></div>
            <div className="bgHistory">
                <div className="history-header">
                    <h3>{t('history.title')}</h3>
                </div>

                {isHistoryLoading ? (
                    <div className="loading">{t('history.loading')}</div>
                ) : (
                    Object.entries(chatHistory)
                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                        .map(([date, dialogues]) => (
                            <div key={date} className="history-date-group">
                                <div className="history-date">{date}</div>
                                {dialogues.map(dialogue => (
                                    <div
                                        key={dialogue.id}
                                        className="history-item"
                                        onClick={() => handleChatSelect(dialogue.id)}
                                    >
                                        {dialogue.preview && (
                                            <div className="history-item-preview">{dialogue.preview}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}

export default HistoryDialogs;