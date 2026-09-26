import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MODULE_LIST } from "../config/contentModules.js";
import { listRecords, getRecord } from "../services/contentService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { admin } = useAuth();
  const [summary, setSummary] = useState({});

  useEffect(() => {
    let cancelled = false;
    MODULE_LIST.forEach((module) => {
      const request = module.singleton ? getRecord(module, null).then(() => 1) : listRecords(module).then((rows) => rows.length);
      request
        .then((count) => !cancelled && setSummary((prev) => ({ ...prev, [module.key]: { count, ok: true } })))
        .catch(() => !cancelled && setSummary((prev) => ({ ...prev, [module.key]: { count: 0, ok: false } })));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalItems = Object.values(summary).reduce((sum, s) => sum + (s.count || 0), 0);
  const imageModules = MODULE_LIST.filter((m) => m.hasImage);

  return (
    <div className="alc-admin-page">
      <div className="alc-admin-page__header">
        <div>
          <h1>Dashboard</h1>
          <p className="alc-admin-page__subtitle">Welcome back, {admin?.email}.</p>
        </div>
      </div>

      <div className="alc-admin-stat-grid">
        <div className="alc-admin-stat-card">
          <span className="alc-admin-stat-card__value">{MODULE_LIST.length}</span>
          <span className="alc-admin-stat-card__label">Content Modules</span>
        </div>
        <div className="alc-admin-stat-card">
          <span className="alc-admin-stat-card__value">{totalItems}</span>
          <span className="alc-admin-stat-card__label">Managed Records</span>
        </div>
        <div className="alc-admin-stat-card">
          <span className="alc-admin-stat-card__value">{imageModules.length}</span>
          <span className="alc-admin-stat-card__label">Modules with Images</span>
        </div>
      </div>

      <h2 className="alc-admin-section-title">Content Sections</h2>
      <div className="alc-admin-module-grid">
        {MODULE_LIST.map((module) => {
          const stat = summary[module.key];
          return (
            <Link key={module.key} to={`/admin/content/${module.key}`} className="alc-admin-module-card">
              <div className="alc-admin-module-card__top">
                <h3>{module.label}</h3>
                {module.hasImage && <span className="alc-admin-badge">Image</span>}
              </div>
              <p>{module.description}</p>
              <span className="alc-admin-module-card__count">
                {!stat ? "Loading…" : stat.ok ? (module.singleton ? "Configured" : `${stat.count} item${stat.count === 1 ? "" : "s"}`) : "Not set up yet"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
