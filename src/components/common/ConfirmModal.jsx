import { useEffect } from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  title = "تأكيد الإجراء",
  message = "هل أنت متأكد من رغبتك في المتابعة؟",
  subMessage,
  confirmText = "نعم، تأكيد",
  cancelText = "إلغاء وتراجع",
  confirmIcon = "fa-solid fa-trash-can",
  confirmType = "danger", // "danger" | "warning" | "primary"
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel && onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="custom-modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="custom-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Warning Icon */}
        <div className={`custom-modal-icon-badge ${confirmType}`}>
          <div className="icon-pulse-ring"></div>
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>

        {/* Modal Texts */}
        <h3 className="custom-modal-title">{title}</h3>
        <p className="custom-modal-message">{message}</p>
        {subMessage && <p className="custom-modal-submessage">{subMessage}</p>}

        {/* Actions Button Group */}
        <div className="custom-modal-actions">
          <button
            className={`custom-modal-btn confirm ${confirmType}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmIcon && <i className={confirmIcon}></i>}
            <span>{confirmText}</span>
          </button>

          <button
            className="custom-modal-btn cancel"
            onClick={onCancel}
          >
            <span>{cancelText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
