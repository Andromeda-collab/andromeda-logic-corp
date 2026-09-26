import { useEffect, useRef, useState } from "react";
import { resolveImageUrl } from "../../services/adminApi.js";
import { checkImageExists, cropImage, uploadImage } from "../../services/uploadService.js";
import { useToast } from "../../context/ToastContext.jsx";
import CropperModal from "./CropperModal.jsx";

// Full image lifecycle for a single content field: view the exact image
// currently live on the public frontend, crop/resize it in place, replace
// it outright, preview the result, and only commit it into the parent
// form's state (never straight to the backend) so the surrounding
// Save/Cancel on the content form is what ultimately decides whether the
// change sticks.
export default function ImageManager({ label, value, onChange }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!value) {
      setExists(null);
      return;
    }
    let cancelled = false;
    setChecking(true);
    checkImageExists(value)
      .then((ok) => !cancelled && setExists(ok))
      .catch(() => !cancelled && setExists(null))
      .finally(() => !cancelled && setChecking(false));
    return () => {
      cancelled = true;
    };
  }, [value]);

  async function handleReplace(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      toast.success("Image replaced. Save the form to publish this change.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleApplyCrop({ x, y, width, height, targetWidth, targetHeight }) {
    try {
      const url = await cropImage({ sourceUrl: value, x, y, width, height, targetWidth, targetHeight });
      onChange(url);
      setShowCropper(false);
      toast.success("Crop applied. Save the form to publish this change.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Crop failed.");
    }
  }

  const previewUrl = resolveImageUrl(value);

  return (
    <div className="alc-admin-image-manager">
      <span className="alc-admin-field-label">{label}</span>

      <div className="alc-admin-image-preview">
        {previewUrl ? (
          <img src={previewUrl} alt={`${label} preview`} onError={(e) => (e.target.style.display = "none")} />
        ) : (
          <div className="alc-admin-image-preview__empty">No image set</div>
        )}
      </div>

      {value && !checking && exists === false && (
        <p className="alc-admin-form__error">
          Original image file is missing from storage. Upload a new image to replace it.
        </p>
      )}

      <div className="alc-admin-image-actions">
        <button
          type="button"
          className="alc-admin-btn alc-admin-btn--ghost"
          disabled={!value || checking || exists === false}
          onClick={() => setShowCropper(true)}
        >
          Crop / Resize
        </button>
        <button
          type="button"
          className="alc-admin-btn alc-admin-btn--ghost"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Replace"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleReplace} />
      </div>

      {showCropper && (
        <CropperModal imageUrl={previewUrl} onCancel={() => setShowCropper(false)} onApply={handleApplyCrop} />
      )}
    </div>
  );
}
