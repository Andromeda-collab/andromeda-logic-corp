import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSpecialtyBySlug } from "../../services/technologyService.js";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

function parseJsonList(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Specialty Deep-Dive detail page — /technology/{specialtySlug} — Section 9.2.
export default function TechnologyDetail() {
  const { specialtySlug } = useParams();
  const [specialty, setSpecialty] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | notfound | error

  useEffect(() => {
    setStatus("loading");
    getSpecialtyBySlug(specialtySlug)
      .then((res) => {
        setSpecialty(res.data);
        setStatus("success");
      })
      .catch((err) => {
        setStatus(err.response?.status === 404 ? "notfound" : "error");
      });
  }, [specialtySlug]);

  return (
    <section className="alc-container alc-section">
      {status === "loading" && <p>Loading specialty…</p>}

      {status === "error" && (
        <p className="alc-form__error">Couldn't load this specialty. Is the backend running?</p>
      )}

      {status === "notfound" && (
        <>
          <h1>Specialty not found</h1>
          <p><Link to="/technology">Back to Technology</Link></p>
        </>
      )}

      {status === "success" && specialty && (
        <>
          <h1>{specialty.name}</h1>
          {specialty.status && <StatusBadge status={specialty.status} />}
          <p>{specialty.short_description}</p>
          {specialty.long_description && <p>{specialty.long_description}</p>}

          {parseJsonList(specialty.capabilities).length > 0 && (
            <>
              <h2>Capabilities</h2>
              <ul>
                {parseJsonList(specialty.capabilities).map((cap, i) => (
                  <li key={i}>{cap}</li>
                ))}
              </ul>
            </>
          )}

          {parseJsonList(specialty.related_products).length > 0 && (
            <>
              <h2>Related Products</h2>
              <ul>
                {parseJsonList(specialty.related_products).map((product, i) => (
                  <li key={i}>{product}</li>
                ))}
              </ul>
            </>
          )}

          {specialty.mission_tag && (
            <p><strong>Mission:</strong> {specialty.mission_tag}</p>
          )}

          <p><Link to="/technology">Back to Technology</Link></p>
        </>
      )}
    </section>
  );
}
