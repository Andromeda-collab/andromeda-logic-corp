import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMissionBySlug } from "../../services/caseStudiesService.js";

// Mission detail page — /missions/{missionSlug} — Section 9.6.
export default function CaseStudyDetail() {
  const { missionSlug } = useParams();
  const [mission, setMission] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getMissionBySlug(missionSlug)
      .then((res) => {
        setMission(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [missionSlug]);

  if (status === "loading") return <section className="alc-container alc-section"><p>Loading…</p></section>;
  if (status === "error" || !mission) {
    return (
      <section className="alc-container alc-section">
        <p className="alc-form__error">Mission not found.</p>
        <Link to="/missions">← Back to Case Studies</Link>
      </section>
    );
  }

  return (
    <section className="alc-container alc-section">
      <Link to="/missions" className="alc-job-back-link">← Back to Case Studies</Link>
      <h1>{mission.title}</h1>
      <p className="alc-mission-summary">{mission.summary}</p>

      {mission.challenge && (
        <div className="alc-mission-block">
          <h3>Challenge</h3>
          <p>{mission.challenge}</p>
        </div>
      )}
      {mission.approach && (
        <div className="alc-mission-block">
          <h3>Approach</h3>
          <p>{mission.approach}</p>
        </div>
      )}
      {mission.technology_used && (
        <div className="alc-mission-block">
          <h3>Technology Used</h3>
          <p>{mission.technology_used}</p>
        </div>
      )}
      {mission.outcome && (
        <div className="alc-mission-block">
          <h3>Outcome</h3>
          <p>{mission.outcome}</p>
        </div>
      )}
    </section>
  );
}