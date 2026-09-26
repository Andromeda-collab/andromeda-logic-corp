// Proof Grid Tile — icon + stat + copy + link. Used in Home "Why Andromeda Logic" module (9.1).
export default function ProofGridTile({ icon, stat, label, href }) {
  return (
    <a className="alc-proof-tile" href={href}>
      <span className="alc-proof-tile__icon">{icon}</span>
      <span className="alc-proof-tile__stat">{stat}</span>
      <span className="alc-proof-tile__label">{label}</span>
    </a>
  );
}
