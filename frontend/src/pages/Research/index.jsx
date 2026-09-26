import { useEffect, useState } from "react";
import Button from "../../components/ui/Button.jsx";
import api from "../../services/api.js";

const INITIAL_FORM = { name: "", institution: "", email: "", research_area: "", message: "" };

// Research & Innovation — Section 9.5.
export default function Research() {
  const [content, setContent] = useState(null);
  const [contentStatus, setContentStatus] = useState("loading");

  const [resources, setResources] = useState([]);
  const [resourcesStatus, setResourcesStatus] = useState("loading");

  const [form, setForm] = useState(INITIAL_FORM);
  const [formStatus, setFormStatus] = useState("idle"); // idle | submitting | success | error

  useEffect(() => {
    api
      .get("/research")
      .then((res) => {
        setContent(res.data);
        setContentStatus("success");
      })
      .catch(() => setContentStatus("error"));

    // Published Research feed — Technical Library filtered to the "research" tag
    api
      .get("/library", { params: { persona: "research" } })
      .then((res) => {
        setResources(res.data);
        setResourcesStatus("success");
      })
      .catch(() => setResourcesStatus("error"));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      await api.post("/research/access-request", form);
      setFormStatus("success");
      setForm(INITIAL_FORM);
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <section className="alc-container alc-section">
      <h1>Research & Innovation</h1>

      {contentStatus === "success" && content && (
        <div className="alc-about-block">
          <p>{content.overview}</p>
          {content.partnership_program && (
            <>
              <h3>Research Partnership Program</h3>
              <p>{content.partnership_program}</p>
            </>
          )}
        </div>
      )}
      {contentStatus === "error" && <p>Research overview hasn't been added yet.</p>}

      {/* Published Research feed */}
      <div className="alc-about-block">
        <h3>Published Research</h3>
        {resourcesStatus === "success" && resources.length === 0 && <p>No published research yet.</p>}
        <div className="alc-press-list">
          {resources.map((r) => (
            <article className="alc-card alc-press-card" key={r.slug}>
              <h3>{r.title}</h3>
              <p>{r.asset_type}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Academic/Agency Access Request form */}
      <div className="alc-about-block">
        <h3>Request Research or Simulation Access</h3>

        {formStatus === "success" ? (
          <p>Thanks — we'll follow up with you shortly.</p>
        ) : (
          <form className="alc-form" onSubmit={handleSubmit}>
            <div className="alc-form__row">
              <label className="alc-form-field">
                <span>Full Name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label className="alc-form-field">
                <span>Institution</span>
                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="alc-form-field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>

            <label className="alc-form-field">
              <span>Research Area</span>
              <input
                type="text"
                name="research_area"
                placeholder="e.g. HITL simulation, radiation-tolerant ML"
                value={form.research_area}
                onChange={handleChange}
              />
            </label>

            <label className="alc-form-field">
              <span>Message</span>
              <textarea name="message" rows="4" value={form.message} onChange={handleChange} />
            </label>

            {formStatus === "error" && (
              <p className="alc-form__error">Something went wrong. Please try again.</p>
            )}

            <Button type="submit" variant="primary" disabled={formStatus === "submitting"}>
              {formStatus === "submitting" ? "Submitting..." : "Request Access"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}