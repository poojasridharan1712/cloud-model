import { useEffect } from "react";

export default function Message({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${message.type}`} role="alert">
      <span>{message.text}</span>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        &times;
      </button>
    </div>
  );
}
