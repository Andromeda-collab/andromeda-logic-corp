import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import satelliteImage from "../../assets/images/satellite-hero.jpg";
import { getHomeContent } from "../../services/homeService.js";
import resolveImageUrl from "../../utils/resolveImageUrl.js";

// Rotating hero carousel — Section 9.1 Hero module ("3-slide rotating
// headline tied to Core Pillars"), adapted from Xebia's rotating video
// hero pattern (Section 5.1). Auto-advances on a timer; segmented
// progress bars at the bottom show timing and are clickable to jump slides.

const SLIDE_DURATION = 5000; // ms per slide

const SLIDES = [
  {
    id: "mission",
    headline: "Intelligent Systems for the Deep Space Era.",
    subtitle:
      "Andromeda Logic Corp engineers autonomous AI, radiation-resilient computing architectures, and deep-space data processing systems to power the next generation of space exploration.",
    image: satelliteImage,
    primaryCta: { label: "Request Mission Consultation", to: "/contact" },
    secondaryCta: { label: "Explore Technology", to: "/technology" },
  },
  {
    id: "gnc",
    headline: "Autonomous Navigation & Deep-Space AI",
    subtitle:
      "Decision-making algorithms enabling real-time hazard avoidance, course correction, and mission adaptation without waiting on Earth-based instructions.",
    gradient: true,
    primaryCta: { label: "Explore GNC", to: "/technology/autonomous-gnc" },
  },
  {
    id: "edge",
    headline: "Extreme-Environment Edge Computing",
    subtitle:
      "Processing logic optimized for high radiation, thermal extremes, and strict power budgets — enabling ML inference on radiation-hardened hardware.",
    gradient: true,
    primaryCta: { label: "Explore Edge Computing", to: "/technology/edge-computing" },
  },
  {
    id: "research",
    headline: "Research Technology & Simulation Frameworks",
    subtitle:
      "HITL simulation environments for aerospace engineers, academic institutions, and defense research programs.",
    gradient: true,
    primaryCta: { label: "Explore Research", to: "/research" },
  },
];

const N = SLIDES.length;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [slides, setSlides] = useState(SLIDES);
  const timerRef = useRef(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Admin-managed override for the first slide (Section 9.1 Home hero content),
  // falling back to the static copy above if the backend is unreachable so
  // the hero never breaks.
  useEffect(() => {
    getHomeContent()
      .then((res) => {
        const content = res.data;
        setSlides((prev) => {
          const next = [...prev];
          next[0] = {
            ...next[0],
            headline: content.mission_title || next[0].headline,
            subtitle: content.mission_description || next[0].subtitle,
            image: content.image_url ? resolveImageUrl(content.image_url) : next[0].image,
          };
          return next;
        });
      })
      .catch(() => {
        /* keep static fallback content */
      });
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;

    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % N);
    }, SLIDE_DURATION);

    return () => clearTimeout(timerRef.current);
  }, [active, paused, reducedMotion]);

  const goTo = (index) => {
    clearTimeout(timerRef.current);
    setActive(index);
  };

  const slide = slides[active];

  return (
    <section
      className="alc-hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="alc-hero-carousel__background">
        {slide.image ? (
          <img src={slide.image} alt="" className="alc-hero-carousel__image" />
        ) : (
          <div className="alc-hero-carousel__gradient alc-gradient-surface" />
        )}
        <div className="alc-hero-carousel__scrim" />
      </div>

      <div className="alc-container alc-hero-carousel__content">
        <h1>{slide.headline}</h1>
        <p className="alc-hero__subtitle">{slide.subtitle}</p>
        <div className="alc-hero__actions">
          <Button as={Link} to={slide.primaryCta.to} variant="primary">
            {slide.primaryCta.label}
          </Button>
          {slide.secondaryCta && (
            <Button as={Link} to={slide.secondaryCta.to} variant="secondary">
              {slide.secondaryCta.label}
            </Button>
          )}
        </div>
      </div>

      <div className="alc-hero-carousel__progress">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className="alc-hero-carousel__segment"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`alc-hero-carousel__fill ${i === active ? "alc-hero-carousel__fill--active" : ""} ${
                i < active ? "alc-hero-carousel__fill--complete" : ""
              }`}
              style={
                i === active && !paused && !reducedMotion
                  ? { animationDuration: `${SLIDE_DURATION}ms` }
                  : undefined
              }
            />
          </button>
        ))}
      </div>
    </section>
  );
}