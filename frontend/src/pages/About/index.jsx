import { useEffect, useState } from "react";
import api from "../../services/api.js";

// Heritage timeline and locations remain static placeholders — the backend
// fields exist but no real data has been entered for them yet. Leadership
// pulls live from the API.

const HERITAGE = [
  { year: "2024", milestone: "Andromeda Logic Corp founded." },
  { year: "2025", milestone: "First HITL Digital Twin Suite deployment for a research partner." },
  { year: "2026", milestone: "Radiation-Tolerant Inference Engine enters roadmap development." },
];

const LOCATIONS = [
  { city: "Bengaluru, India", type: "Engineering HQ" },
  { city: "Remote", type: "Distributed Mission Operations Team" },
];

export default function About() {
  const [about, setAbout] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/about")
      .then((res) => {
        setAbout(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  let leadership = [];
  if (about?.leadership) {
    try {
      const parsed = JSON.parse(about.leadership);
      if (Array.isArray(parsed)) {
        leadership = parsed;
      }
    } catch {
      leadership = [];
    }
  }

  return (
    <section className="alc-container alc-section">
      <h1>About Us</h1>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && <p>About page content hasn't been added yet.</p>}

      {status === "success" && about && (
        <>
          <div className="alc-about-block">
            <h3>Mission</h3>
            <p>{about.mission_statement}</p>
          </div>
          <div className="alc-about-block">
            <h3>Vision</h3>
            <p>{about.vision_statement}</p>
          </div>
        </>
      )}

      {leadership.length > 0 && (
        <div className="alc-about-block">
          <h3>Leadership Team</h3>
          <div className="alc-leadership-grid">
            {leadership.map((person) => (
              <div className="alc-card alc-leadership-card" key={person.title}>
                <h3>{person.title}</h3>
                <p>{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="alc-about-block">
        <h3>Company Heritage</h3>
        <div className="alc-timeline">
          {HERITAGE.map((item) => (
            <div className="alc-timeline__item" key={item.year}>
              <span className="alc-timeline__year">{item.year}</span>
              <p>{item.milestone}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="alc-about-block">
        <h3>Locations</h3>
        <div className="alc-locations-grid">
          {LOCATIONS.map((loc) => (
            <div className="alc-card" key={loc.city}>
              <h3>{loc.city}</h3>
              <p>{loc.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}