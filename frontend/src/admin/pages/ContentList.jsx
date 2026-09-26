import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MODULES } from "../config/contentModules.js";
import { listRecords, deleteRecord } from "../services/contentService.js";
import { useToast } from "../context/ToastContext.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

function formatCell(value) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export default function ContentList() {
  const { moduleKey } = useParams();
  const module = MODULES[moduleKey];
  const toast = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (!module || module.singleton) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  function load() {
    setLoading(true);
    setError(false);
    listRecords(module)
      .then(setRows)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  if (!module) return <Navigate to="/admin" replace />;
  if (module.singleton) return <Navigate to={`/admin/content/${moduleKey}/edit`} replace />;

  async function confirmDelete() {
    const id = pendingDelete[module.idField];
    try {
      await deleteRecord(module, id);
      toast.success(`${module.label} entry deleted.`);
      setRows((prev) => prev.filter((r) => r[module.idField] !== id));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed.");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="alc-admin-page">
      <div className="alc-admin-page__header">
        <div>
          <h1>{module.label}</h1>
          <p className="alc-admin-page__subtitle">{module.description}</p>
        </div>
        {!module.readOnly && (
          <Link to={`/admin/content/${moduleKey}/new`} className="alc-admin-btn alc-admin-btn--primary">
            + Add New
          </Link>
        )}
      </div>

      {loading && <p className="alc-admin-empty-state">Loading…</p>}
      {error && <p className="alc-admin-form__error">Couldn't load this content. Is the backend running?</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="alc-admin-empty-state">No entries yet. Click "Add New" to create the first one.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="alc-admin-table-wrap">
          <table className="alc-admin-table">
            <thead>
              <tr>
                {module.listColumns.map((col) => (
                  <th key={col}>{col.replace(/_/g, " ")}</th>
                ))}
                <th className="alc-admin-table__actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[module.idField]}>
                  {module.listColumns.map((col) => (
                    <td key={col}>{formatCell(row[col])}</td>
                  ))}
                  <td className="alc-admin-table__actions">
                    <Link to={`/admin/content/${moduleKey}/${row[module.idField]}/edit`} className="alc-admin-btn alc-admin-btn--ghost alc-admin-btn--small">
                      {module.readOnly ? "View" : "Edit"}
                    </Link>
                    {!module.readOnly && (
                      <button
                        type="button"
                        className="alc-admin-btn alc-admin-btn--danger alc-admin-btn--small"
                        onClick={() => setPendingDelete(row)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete this ${module.label.toLowerCase()} entry?`}
        message={`This permanently removes "${pendingDelete?.[module.listColumns[1]] || pendingDelete?.[module.idField]}" and it will disappear from the public site. This can't be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
