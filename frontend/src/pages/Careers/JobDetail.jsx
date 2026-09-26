import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import { getRequisitionBySlug } from "../../services/careersService.js";

// Job Requisition detail — /careers/{jobSlug} — Section 9.8.
export default function JobDetail() {
  const { jobSlug } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getRequisitionBySlug(jobSlug)
      .then((res) => {
        setJob(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [jobSlug]);

  if (status === "loading") return <section className="alc-container alc-section"><p>Loading…</p></section>;
  if (status === "error" || !job) {
    return (
      <section className="alc-container alc-section">
        <p className="alc-form__error">Role not found.</p>
        <Link to="/careers">← Back to Careers</Link>
      </section>
    );
  }

  return (
    <section className="alc-container alc-section">
      <Link to="/careers" className="alc-job-back-link">← Back to Careers</Link>
      <h1>{job.title}</h1>
      <p className="alc-job-card__meta">
        {job.discipline}
        {job.location ? ` · ${job.location}` : ""}
        {job.requires_clearance ? " · Clearance Required" : ""}
      </p>

      {job.description && <p className="alc-job-description">{job.description}</p>}

      <Button as={Link} to="/contact" variant="primary">
        Apply — Request Mission Consultation
      </Button>
    </section>
  );
}