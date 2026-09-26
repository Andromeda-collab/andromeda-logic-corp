import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMissions } from "../../services/caseStudiesService.js";
import resolveImageUrl from "../../utils/resolveImageUrl.js";

// Case Studies & Mission Stories Hub — Section 9.6.
export default function CaseStudiesHub() {
  const [missions, setMissions] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getMissions()
      .then((res) => {
        setMissions(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Case Studies & Mission Stories</h1>
      <p className="alc-contact-intro">
        Real missions, real outcomes — the technology behind Andromeda Logic Corp
        proven in the field.
      </p>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load mission stories. Is the backend running?</p>
      )}
      {status === "success" && missions.length === 0 && (
        <p>No mission stories published yet.</p>
      )}

      <div className="alc-mission-grid">
        {missions.map((m) => (
          <Link className="alc-card alc-mission-card" to={`/missions/${m.slug}`} key={m.slug}>
            {m.image_url && (
              <img
                src={resolveImageUrl(m.image_url)}
                alt=""
                className="alc-card__image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <h3>{m.title}</h3>
            <p>{m.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}