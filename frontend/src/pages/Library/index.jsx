import { useEffect, useState } from "react";
import api from "../../services/api.js";

const ASSET_TYPES = [
  { value: "", label: "All Types" },
  { value: "whitepaper", label: "Whitepaper" },
  { value: "spec_sheet", label: "Spec Sheet" },
  { value: "briefing", label: "Briefing" },
  { value: "case_study", label: "Case Study" },
];

// Technical Library / Resources — Section 9.10. Filterable whitepaper/spec-sheet catalog.
export default function Library() {
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState("loading");
  const [assetType, setAssetType] = useState("");

  useEffect(() => {
    setStatus("loading");
    api
      .get("/library", { params: assetType ? { asset_type: assetType } : {} })
      .then((res) => {
        setResources(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [assetType]);

  return (
    <section className="alc-container alc-section">
      <h1>Technical Library</h1>
      <p className="alc-contact-intro">
        Whitepapers, spec sheets, and briefings across our five core specialties.
      </p>

      <div className="alc-library-filter">
        <label className="alc-form-field">
          <span>Filter by type</span>
          <select value={assetType} onChange={(e) => setAssetType(e.target.value)}>
            {ASSET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load resources. Is the backend running?</p>
      )}
      {status === "success" && resources.length === 0 && <p>No resources match this filter.</p>}

      <div className="alc-library-list">
        {resources.map((r) => (
          <div className="alc-card alc-library-card" key={r.slug}>
            <div className="alc-library-card__meta">
              <span className="alc-status-badge alc-status-badge--roadmap">
                {r.asset_type.replace("_", " ")}
              </span>
              {r.is_gated && (
                <span className="alc-status-badge alc-status-badge--in-development">Gated</span>
              )}
            </div>
            <h3>{r.title}</h3>
            <p className="alc-library-card__date">{r.published_date}</p>
          </div>
        ))}
      </div>
    </section>
  );
}