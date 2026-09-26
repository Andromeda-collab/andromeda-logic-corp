import { useEffect, useState } from "react";
import api from "../../services/api.js";

// Trust, Compliance & Export Control Center — Section 9.14.
export default function Trust() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/trust")
      .then((res) => {
        setContent(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  let certifications = [];
  if (content?.certifications) {
    try {
      const parsed = JSON.parse(content.certifications);
      if (Array.isArray(parsed)) {
        certifications = parsed;
      }
    } catch {
      certifications = [];
    }
  }

  return (
    <section className="alc-container alc-section">
      <h1>Trust, Compliance & Export Control</h1>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Trust Center content hasn't been added yet.</p>}

      {status === "success" && content && (
        <>
          {certifications.length > 0 && (
            <div className="alc-about-block">
              <h3>Compliance & Certifications</h3>
              <div className="alc-cert-grid">
                {certifications.map((cert) => (
                  <div className="alc-card alc-cert-card" key={cert.name}>
                    <span className="alc-status-badge alc-status-badge--roadmap">{cert.status}</span>
                    <h3>{cert.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="alc-about-block">
            <h3>Export Control Posture</h3>
            <p>{content.export_control_posture}</p>
          </div>

          <div className="alc-about-block">
            <h3>Gated Content Policy</h3>
            <p>{content.gated_content_policy}</p>
          </div>

          <div className="alc-about-block">
            <h3>Data Privacy & Security Practices</h3>
            <p>{content.data_privacy_practices}</p>
          </div>

          <div className="alc-about-block">
            <h3>Responsible Disclosure</h3>
            <p>
              For coordinated vulnerability disclosure, contact{" "}
              <a href={`mailto:${content.responsible_disclosure_email}`}>
                {content.responsible_disclosure_email}
              </a>
              .
            </p>
          </div>
        </>
      )}
    </section>
  );
}