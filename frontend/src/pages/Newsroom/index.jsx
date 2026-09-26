import { useEffect, useState } from "react";
import { getPressItems } from "../../services/newsroomService.js";

// Newsroom & Press — Section 9.7. Press release feed + external coverage rail.
export default function Newsroom() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getPressItems()
      .then((res) => {
        setItems(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Newsroom</h1>
      <p className="alc-contact-intro">
        Announcements, milestones, and coverage of Andromeda Logic Corp in the
        press.
      </p>

      {status === "loading" && <p>Loading…</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load press items. Is the backend running?</p>
      )}
      {status === "success" && items.length === 0 && <p>No press items yet.</p>}

      <div className="alc-press-list">
        {items.map((item) => (
          <article className="alc-card alc-press-card" key={item.slug}>
            <div className="alc-press-card__meta">
              <span>{item.published_date}</span>
              {item.is_external && item.source_outlet && (
                <span className="alc-status-badge alc-status-badge--roadmap">
                  {item.source_outlet}
                </span>
              )}
            </div>
            <h3>{item.title}</h3>
            {item.body && <p>{item.body}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}