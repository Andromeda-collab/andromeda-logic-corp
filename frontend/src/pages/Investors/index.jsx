import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import api from "../../services/api.js";

// Investors & Partners — Section 9.11.
export default function Investors() {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/investors")
      .then((res) => {
        setContent(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Investors & Partners</h1>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>Investors content hasn't been added yet.</p>}

      {status === "success" && content && (
        <>
          <div className="alc-about-block">
            <h3>Company Snapshot</h3>
            <p>{content.company_snapshot}</p>
          </div>

          <div className="alc-about-block">
            <h3>Partner Program</h3>
            <p>{content.partner_program}</p>
          </div>

          <div className="alc-about-block">
            <h3>Disclosures</h3>
            <p className="alc-contact-intro">
              {content.disclosures || "Financial and press disclosures will appear here as they become available."}
            </p>
          </div>
        </>
      )}

      <Button as={Link} to="/contact" variant="primary">
        Inquire About Partnership
      </Button>
    </section>
  );
}