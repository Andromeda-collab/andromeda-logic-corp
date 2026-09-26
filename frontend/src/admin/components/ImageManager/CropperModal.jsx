import { useRef, useState } from "react";

const DISPLAY_MAX_WIDTH = 560;
const DISPLAY_MAX_HEIGHT = 420;

// Pure CSS/DOM drag-to-select cropper. Deliberately never touches
// <canvas>.getImageData()/toDataURL() — the actual pixel crop happens
// server-side via Pillow, so this UI can't be broken by cross-origin
// canvas tainting, which is the classic cause of "could not load image
// for editing" failures in canvas-based croppers.
export default function CropperModal({ imageUrl, onCancel, onApply }) {
  const imgRef = useRef(null);
  const frameRef = useRef(null);
  const [naturalSize, setNaturalSize] = useState(null);
  const [displaySize, setDisplaySize] = useState(null);
  const [selection, setSelection] = useState(null); // {x, y, width, height} in displayed px
  const [dragStart, setDragStart] = useState(null);
  const [resizeToWidth, setResizeToWidth] = useState("");
  const [resizeToHeight, setResizeToHeight] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleImageLoad(e) {
    const el = e.target;
    setNaturalSize({ width: el.naturalWidth, height: el.naturalHeight });
    const scale = Math.min(DISPLAY_MAX_WIDTH / el.naturalWidth, DISPLAY_MAX_HEIGHT / el.naturalHeight, 1);
    const width = Math.round(el.naturalWidth * scale);
    const height = Math.round(el.naturalHeight * scale);
    setDisplaySize({ width, height });
    // Default selection: centered 80% box.
    setSelection({ x: width * 0.1, y: height * 0.1, width: width * 0.8, height: height * 0.8 });
  }

  function pointerPos(e) {
    const rect = frameRef.current.getBoundingClientRect();
    return {
      x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
      y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
    };
  }

  function handleMouseDown(e) {
    if (!displaySize) return;
    const pos = pointerPos(e);
    setDragStart(pos);
    setSelection({ x: pos.x, y: pos.y, width: 0, height: 0 });
  }

  function handleMouseMove(e) {
    if (!dragStart) return;
    const pos = pointerPos(e);
    const x = Math.min(dragStart.x, pos.x);
    const y = Math.min(dragStart.y, pos.y);
    const width = Math.abs(pos.x - dragStart.x);
    const height = Math.abs(pos.y - dragStart.y);
    setSelection({ x, y, width, height });
  }

  function handleMouseUp() {
    setDragStart(null);
  }

  async function handleApply() {
    if (!selection || !naturalSize || !displaySize || selection.width < 4 || selection.height < 4) return;
    const scaleX = naturalSize.width / displaySize.width;
    const scaleY = naturalSize.height / displaySize.height;
    setSaving(true);
    try {
      await onApply({
        x: selection.x * scaleX,
        y: selection.y * scaleY,
        width: selection.width * scaleX,
        height: selection.height * scaleY,
        targetWidth: resizeToWidth ? Number(resizeToWidth) : undefined,
        targetHeight: resizeToHeight ? Number(resizeToHeight) : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="alc-admin-modal-backdrop" onMouseDown={onCancel}>
      <div className="alc-admin-modal alc-admin-modal--wide" onMouseDown={(e) => e.stopPropagation()}>
        <h3>Crop &amp; Resize Image</h3>

        {loadFailed ? (
          <div className="alc-admin-form__error">
            Could not load the current image for editing. Try replacing it instead.
          </div>
        ) : (
          <>
            <div
              className="alc-admin-cropper-frame"
              ref={frameRef}
              style={displaySize ? { width: displaySize.width, height: displaySize.height } : undefined}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Image being edited"
                crossOrigin="anonymous"
                onLoad={handleImageLoad}
                onError={() => setLoadFailed(true)}
                draggable={false}
                className="alc-admin-cropper-image"
              />
              {selection && displaySize && (
                <div
                  className="alc-admin-cropper-selection"
                  style={{
                    left: selection.x,
                    top: selection.y,
                    width: selection.width,
                    height: selection.height,
                  }}
                />
              )}
            </div>

            <p className="alc-admin-cropper-hint">Click and drag on the image to select the crop area.</p>

            <div className="alc-admin-form-row">
              <label>
                Resize width (px, optional)
                <input type="number" min="1" value={resizeToWidth} onChange={(e) => setResizeToWidth(e.target.value)} />
              </label>
              <label>
                Resize height (px, optional)
                <input type="number" min="1" value={resizeToHeight} onChange={(e) => setResizeToHeight(e.target.value)} />
              </label>
            </div>
          </>
        )}

        <div className="alc-admin-modal__actions">
          <button type="button" className="alc-admin-btn alc-admin-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="alc-admin-btn alc-admin-btn--primary"
            disabled={loadFailed || saving || !selection || selection.width < 4}
            onClick={handleApply}
          >
            {saving ? "Applying…" : "Apply Crop"}
          </button>
        </div>
      </div>
    </div>
  );
}
