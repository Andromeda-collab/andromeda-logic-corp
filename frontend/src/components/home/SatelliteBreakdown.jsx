import { useEffect, useRef, useState } from "react";
import satelliteImage from "../../assets/images/satellite-hero.jpg";
import partLeftPanel from "../../assets/images/part-left-panel.jpg";
import partSensorTop from "../../assets/images/part-sensor-top.jpg";
import partRightPanel from "../../assets/images/part-right-panel.jpg";
import partThruster from "../../assets/images/part-thruster.jpg";

// Pinned-image scrollytelling section — matches Skyroot's Vikram-I/II
// pattern (Section 5.4): the full vehicle image stays whole and sticky
// while text content and small accent renders change per scroll stage.
// This does NOT explode the image apart — that was the wrong mental
// model; Skyroot's actual mechanic keeps the hero image intact.

const STAGES = [
  {
    id: "gnc",
    label: "Autonomous Navigation",
    title: "Made for Autonomous Navigation",
    copy: "Real-time hazard detection, autonomous landing, and orbital station-keeping without waiting on ground telemetry.",
    bullets: ["Real-time hazard avoidance", "Trajectory self-correction"],
    accentImg: partSensorTop,
  },
  {
    id: "power",
    label: "Power Distribution",
    title: "Made for Continuous Power",
    copy: "Solar arrays feed a swarm-aware power grid that reroutes load across systems without ground intervention.",
    bullets: ["Autonomous load balancing", "Multi-panel redundancy"],
    accentImg: partLeftPanel,
  },
  {
    id: "edge",
    label: "Edge Computing",
    title: "Made for In-Orbit Processing",
    copy: "Onboard processing filters and compresses camera, optical, and telemetry data before it ever reaches the downlink.",
    bullets: ["Onboard data reduction", "Downlink prioritization"],
    accentImg: partRightPanel,
  },
  {
    id: "propulsion",
    label: "HITL-Validated Propulsion",
    title: "Made for Proven Reliability",
    copy: "Thruster control logic is proven in hardware-in-the-loop simulation before it ever reaches orbit.",
    bullets: ["HITL pre-flight validation", "Digital twin testing"],
    accentImg: partThruster,
  },
];

const N = STAGES.length;

export default function SatelliteBreakdown() {
  const wrapperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    if (mql.matches) return;

    let ticking = false;
    function measure() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      const idx = Math.min(N - 1, Math.floor(progress * N));
      setActiveIndex(idx);
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        measure();
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    measure();
    const settleTimer = setTimeout(measure, 300);
    window.addEventListener("load", measure);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("load", measure);
      clearTimeout(settleTimer);
    };
  }, []);

  const stage = STAGES[reducedMotion ? 0 : activeIndex];

  return (
    <section
      className={`alc-vikram-wrapper ${reducedMotion ? "alc-vikram-wrapper--static" : ""}`}
      ref={wrapperRef}
    >
      <div className="alc-vikram-sticky alc-container">
        <div className="alc-vikram-grid">
          {/* Left: text panel that changes per stage */}
          <div className="alc-vikram-text">
            <span className="alc-vikram-index">
              {String(activeIndex + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <h2 key={stage.id + "-title"} className="alc-vikram-fade">
              {stage.title}
            </h2>
            <p key={stage.id + "-copy"} className="alc-vikram-fade">
              {stage.copy}
            </p>
            <ul key={stage.id + "-bullets"} className="alc-vikram-bullets alc-vikram-fade">
              {stage.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          {/* Right: whole image, pinned, with a small accent render fading in per stage */}
          <div className="alc-vikram-visual">
            <img src={satelliteImage} alt="Andromeda Logic Corp satellite platform" className="alc-vikram-main-image" />
            <img
              key={stage.id + "-accent"}
              src={stage.accentImg}
              alt=""
              aria-hidden="true"
              className="alc-vikram-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}