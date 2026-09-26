// Status Badge — Flight-Proven / In Development / Roadmap. Section 7.2 semantic colors.
const LABELS = {
  "flight-proven": "Flight-Proven",
  "in-development": "In Development",
  "roadmap": "Roadmap",
};

export default function StatusBadge({ status }) {
  return <span className={`alc-status-badge alc-status-badge--${status}`}>{LABELS[status] || status}</span>;
}
