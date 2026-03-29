import { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`alert alert-${type} ${visible ? 'alert-enter' : 'alert-exit'}`}>
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-message">{message}</span>
      {onClose && (
        <button className="alert-close" onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;
