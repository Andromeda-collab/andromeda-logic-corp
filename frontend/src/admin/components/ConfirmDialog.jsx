export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="alc-admin-modal-backdrop" onMouseDown={onCancel}>
      <div className="alc-admin-modal alc-admin-modal--small" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="alc-admin-modal__message">{message}</p>
        <div className="alc-admin-modal__actions">
          <button type="button" className="alc-admin-btn alc-admin-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`alc-admin-btn ${danger ? "alc-admin-btn--danger" : "alc-admin-btn--primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
