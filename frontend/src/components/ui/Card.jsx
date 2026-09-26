// Shared card shell — Pillar / Product / Persona / Press / Resource variants. Section 7.8.
export default function Card({ variant = "default", children }) {
  return <div className={`alc-card alc-card--${variant}`}>{children}</div>;
}
