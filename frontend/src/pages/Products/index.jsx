import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge.jsx";
import { getPlatforms } from "../../services/productsService.js";
import resolveImageUrl from "../../utils/resolveImageUrl.js";

// Products & Platforms Hub — Section 9.3. Five named platform cards.
export default function ProductsHub() {
  const [platforms, setPlatforms] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getPlatforms()
      .then((res) => {
        setPlatforms(res.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <section className="alc-container alc-section">
      <h1>Products & Platforms</h1>
      <p className="alc-contact-intro">
        Named, packaged platforms — the commercial and licensable face of our
        technology.
      </p>

      {status === "loading" && <p>Loading platforms…</p>}
      {status === "error" && (
        <p className="alc-form__error">Couldn't load platforms. Is the backend running?</p>
      )}
      {status === "success" && platforms.length === 0 && <p>No platforms added yet.</p>}

      <div className="alc-rail alc-rail--wrap">
        {platforms.map((p) => (
          <Link className="alc-card alc-card--product" to={`/products/${p.slug}`} key={p.slug}>
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
            <StatusBadge status={p.status} />
            <h3>{p.name}</h3>
            <p>{p.one_line_pitch}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}