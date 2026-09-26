import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MODULES, emptyRecord } from "../config/contentModules.js";
import { createRecord, getRecord, updateRecord } from "../services/contentService.js";
import { useToast } from "../context/ToastContext.jsx";
import ImageManager from "../components/ImageManager/ImageManager.jsx";

function Field({ field, value, onChange, readOnly }) {
  const commonProps = {
    id: field.name,
    required: field.required,
    disabled: readOnly,
  };

  if (field.type === "textarea") {
    return <textarea {...commonProps} rows={4} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === "checkbox") {
    return <input {...commonProps} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
  }
  if (field.type === "select") {
    return (
      <select {...commonProps} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          Select…
        </option>
        {field.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "date") {
    return <input {...commonProps} type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input {...commonProps} type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

export default function ContentEdit() {
  const { moduleKey, id } = useParams();
  const module = MODULES[moduleKey];
  const navigate = useNavigate();
  const toast = useToast();

  const isCreate = !module?.singleton && id === undefined && !module?.readOnly;
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(!isCreate);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!module) return;
    if (isCreate) {
      setRecord(emptyRecord(module));
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    getRecord(module, id)
      .then(setRecord)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey, id]);

  if (!module) return <Navigate to="/admin" replace />;
  if (module.readOnly && id === undefined) return <Navigate to={`/admin/content/${moduleKey}`} replace />;

  function updateField(name, value) {
    setRecord((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...record };
      // Strip the read-only DB id the GET responses include before writing back.
      delete payload.id;
      if (isCreate) {
        await createRecord(module, payload);
        toast.success(`${module.label} entry created.`);
      } else {
        const recordId = module.singleton ? null : id;
        await updateRecord(module, recordId, payload);
        toast.success(`${module.label} saved.`);
      }
      navigate(module.singleton ? "/admin" : `/admin/content/${moduleKey}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Save failed. Check the form and try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    navigate(module.singleton ? "/admin" : `/admin/content/${moduleKey}`);
  }

  return (
    <div className="alc-admin-page">
      <div className="alc-admin-page__header">
        <div>
          <h1>{module.readOnly ? `View ${module.label}` : isCreate ? `Add ${module.label}` : `Edit ${module.label}`}</h1>
          <p className="alc-admin-page__subtitle">{module.description}</p>
        </div>
      </div>

      {loading && <p className="alc-admin-empty-state">Loading…</p>}
      {loadError && <p className="alc-admin-form__error">Couldn't load this entry.</p>}

      {!loading && !loadError && record && (
        <form className="alc-admin-form" onSubmit={module.readOnly ? (e) => e.preventDefault() : handleSubmit}>
          {module.hasImage && (
            <ImageManager
              label={module.imageLabel || "Image"}
              value={record[module.imageField]}
              onChange={(url) => updateField(module.imageField, url)}
            />
          )}

          <div className="alc-admin-form-grid">
            {module.fields.map((field) => (
              <div
                key={field.name}
                className={`alc-admin-form-field ${field.type === "textarea" ? "alc-admin-form-field--wide" : ""} ${
                  field.type === "checkbox" ? "alc-admin-form-field--checkbox" : ""
                }`}
              >
                <label htmlFor={field.name}>
                  {field.type === "checkbox" ? null : field.label}
                </label>
                <Field field={field} value={record[field.name]} onChange={(v) => updateField(field.name, v)} readOnly={module.readOnly} />
                {field.type === "checkbox" && <span className="alc-admin-checkbox-label">{field.label}</span>}
              </div>
            ))}
          </div>

          <div className="alc-admin-form__actions">
            <button type="button" className="alc-admin-btn alc-admin-btn--ghost" onClick={handleCancel} disabled={saving}>
              {module.readOnly ? "Back" : "Cancel"}
            </button>
            {!module.readOnly && (
              <button type="submit" className="alc-admin-btn alc-admin-btn--primary" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
