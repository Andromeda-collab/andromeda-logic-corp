import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpecialties } from "../../services/technologyService.js";

// Technology Hub — Section 9.2. Five Core Specialty blocks + Procurement FAQ.
export default function TechnologyHub() {
  const [specialties, setSpecialties] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    getSpecialties()
      .then((res) => {
        setSpecialties(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Technology</h1>
      <p className="alc-contact-intro">
        Five core specialties power everything Andromeda Logic Corp builds for
        the deep-space era.
      </p>

      {status === "loading" && <p>Loading specialties…</p>}
      {status === "error" && (
        <p className="alc-form__error">
          Couldn't load specialties. Is the backend running?
        </p>
      )}

      {status === "success" && specialties.length === 0 && (
        <p>No specialties added yet.</p>
      )}

      <div className="alc-specialty-list">
        {specialties.map((s) => (
          <Link to={`/technology/${s.slug}`} className="alc-card alc-specialty-card" key={s.slug}>
            <h3>{s.name}</h3>
            <p>{s.short_description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}