import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRequisitions } from "../../services/careersService.js";

// Careers Hub — Section 9.8. Culture storytelling + live requisition list.
export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getRequisitions()
      .then((res) => {
        setJobs(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Careers</h1>
      <p className="alc-contact-intro">
        We're building the computational backbone for humanity's multi-planetary
        future — join a team of aerospace, AI/ML, and embedded-systems engineers.
      </p>

      {status === "loading" && <p>Loading open roles…</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load open roles. Is the backend running?</p>
      )}
      {status === "success" && jobs.length === 0 && <p>No open roles right now — check back soon.</p>}

      <div className="alc-job-list">
        {jobs.map((job) => (
          <Link className="alc-card alc-job-card" to={`/careers/${job.slug}`} key={job.slug}>
            <div className="alc-job-card__header">
              <h3>{job.title}</h3>
              {job.requires_clearance && (
                <span className="alc-status-badge alc-status-badge--roadmap">
                  Clearance Required
                </span>
              )}
            </div>
            <p className="alc-job-card__meta">
              {job.discipline}
              {job.location ? ` · ${job.location}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}