import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPersonas } from "../../services/solutionsService.js";
import resolveImageUrl from "../../utils/resolveImageUrl.js";

// Solutions by Audience Hub — Section 9.4. Four persona tiles.
export default function SolutionsHub() {
  const [personas, setPersonas] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getPersonas()
      .then((res) => {
        setPersonas(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Solutions by Audience</h1>
      <p className="alc-contact-intro">
        Tailored engagement paths for the four groups we work with most.
      </p>

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load solutions. Is the backend running?</p>
      )}
      {status === "success" && personas.length === 0 && <p>No persona pages added yet.</p>}

      <div className="alc-persona-grid">
        {personas.map((p) => (
          <Link className="alc-card alc-card--persona" to={`/solutions/${p.slug}`} key={p.slug}>
            {p.image_url && (
              <img
                src={resolveImageUrl(p.image_url)}
                alt=""
                className="alc-card__image"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <h3>{p.name}</h3>
            <p>{p.narrative}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}