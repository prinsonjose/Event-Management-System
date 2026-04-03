import './Popup.css';

const Popup = ({ type = 'info', title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', show = true }) => {
  if (!show) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    confirm: '❓',
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-container popup-${type}`}>
        <div className="popup-icon">{icons[type]}</div>
        <div className="popup-content">
          {title && <h3 className="popup-title">{title}</h3>}
          <p className="popup-message">{message}</p>
        </div>
        <div className="popup-actions">
          {onCancel && (
            <button className="btn btn-outline" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
