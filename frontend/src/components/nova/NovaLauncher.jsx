import { useState } from "react";
import NovaPanel from "./NovaPanel.jsx";

// NOVA AI Mission Assistant — persistent floating launcher.
// Placement contract: Section 8.5. Full capability spec: Section 10.
// Sub-modules to implement: Knowledge Mode, Solutions Navigator,
// Document Concierge, Mission Consultation Pre-Qualifier (10.3).
export default function NovaLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="alc-nova-launcher alc-gradient-surface"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open NOVA AI Mission Assistant"
      >
        NOVA
      </button>
      {open && <NovaPanel onClose={() => setOpen(false)} />}
    </>
  );
}
