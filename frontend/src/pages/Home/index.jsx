import { Link } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import ProofGridTile from "../../components/ui/ProofGridTile.jsx";
import StatusBadge from "../../components/ui/StatusBadge.jsx";

import SatelliteBreakdown from "../../components/home/SatelliteBreakdown.jsx";
import HeroCarousel from "../../components/home/HeroCarousel.jsx";

// Home Page — Section 9.1
const PILLARS = [
  {
    title: "Autonomous Navigation & Deep-Space AI",
    copy: "Decision-making algorithms enabling real-time hazard avoidance, course correction, and mission adaptation without waiting on Earth-based instructions.",
    href: "/technology/autonomous-gnc",
  },
  {
    title: "Extreme-Environment Edge Computing",
    copy: "Processing logic optimized for high radiation, thermal extremes, and strict power budgets.",
    href: "/technology/edge-computing",
  },
  {
    title: "High-Volume Cosmic Data & Signal Processing",
    copy: "Intelligent pipelines that compress, filter, and analyze scientific data in orbit.",
    href: "/technology/radiation-tolerant-ai",
  },
  {
    title: "Research Technology & Simulation Frameworks",
    copy: "HITL simulation environments for aerospace engineers, academic institutions, and defense research programs.",
    href: "/technology/hitl-simulation",
  },
];

const PLATFORMS = [
  { slug: "edge-payload", name: "EDGE Payload", pitch: "Onboard edge-compute payload for data reduction.", status: "in-development" },
  { slug: "gnc-autonomy-stack", name: "GNC Autonomy Stack", pitch: "Autonomous guidance, navigation & control software.", status: "in-development" },
  { slug: "swarm-orchestrator", name: "Swarm Orchestrator", pitch: "Multi-agent orchestration for satellite constellations.", status: "roadmap" },
  { slug: "hitl-digital-twin-suite", name: "HITL Digital Twin Suite", pitch: "Hardware-in-the-loop simulation environment.", status: "in-development" },
  { slug: "radiation-tolerant-inference-engine", name: "Radiation-Tolerant Inference Engine", pitch: "ML inference optimized for radiation-hardened hardware.", status: "roadmap" },
];

const PERSONAS = [
  { slug: "space-agencies", label: "Space Agencies" },
  { slug: "commercial", label: "Commercial Space Operators" },
  { slug: "defense", label: "Defense & National Security" },
  { slug: "research", label: "Research Institutions & Academia" },
];

export default function Home() {
  return (
    <>
      {/* Rotating hero carousel — Section 9.1 Hero module */}
      <HeroCarousel />

      {/* Intro block — bridges Hero to the satellite breakdown */}
      <section className="alc-container alc-intro-block">
        <h2>Built for the Deep Space Era</h2>
        <p>
          Every system we build is engineered to operate independently, hundreds of
          thousands of kilometers from ground control — from autonomous navigation
          to radiation-hardened compute, each component below plays a role in
          keeping missions running without waiting on Earth.
        </p>
      </section>

      {/* Scroll-driven satellite exploded-view breakdown */}
      <SatelliteBreakdown />

      {/* Trust Proof grid — "Why Andromeda Logic" */}
      <section className="alc-container alc-section">
        <h2>Why Andromeda Logic</h2>
        <div className="alc-proof-grid">
          <ProofGridTile icon="🚀" stat="5" label="Core Specialties in Deep-Space AI" href="/technology" />
          <ProofGridTile icon="🛡️" stat="IP" label="Radiation-Tolerant Compute Architecture" href="/products" />
          <ProofGridTile icon="🧪" stat="HITL" label="Hardware-in-the-Loop Validation Rigor" href="/research" />
          <ProofGridTile icon="🌐" stat="Multi-Agency" label="Trust Across Agencies & Operators" href="/solutions" />
        </div>
      </section>

      {/* Core Pillars showcase — Section 2.3 */}
      <section className="alc-container alc-section">
        <h2>Core Pillars</h2>
        <div className="alc-pillar-grid">
          {PILLARS.map((pillar) => (
            <div className="alc-card alc-card--pillar" key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <Link to={pillar.href}>Explore More →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Products Rail — Section 9.3 platforms */}
      <section className="alc-container alc-section">
        <h2>Products & Platforms</h2>
        <div className="alc-rail">
          {PLATFORMS.map((p) => (
            <Link className="alc-card alc-card--product" to={`/products/${p.slug}`} key={p.slug}>
              <StatusBadge status={p.status} />
              <h3>{p.name}</h3>
              <p>{p.pitch}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Audience Selector — Section 9.4 persona cards */}
      <section className="alc-container alc-section">
        <h2>Solutions by Audience</h2>
        <div className="alc-persona-grid">
          {PERSONAS.map((persona) => (
            <Link className="alc-card alc-card--persona" to={`/solutions/${persona.slug}`} key={persona.slug}>
              {persona.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Conversion band */}
      <section className="alc-container alc-section alc-conversion-band">
        <h2>Ready to talk about your mission?</h2>
        <Button as={Link} to="/contact" variant="primary">
          Request Mission Consultation
        </Button>
      </section>
    </>
  );
}