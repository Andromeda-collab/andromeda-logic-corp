import { useState } from "react";

// Cookie Consent & Privacy Preference Center — Section 8.3.
// Granular preferences (Necessary / Analytics / Marketing), consent logged
// server-side for audit purposes (defense-adjacent posture, Section 3.4 / 14.2).
// TODO: wire to POST /api/v1/consent and gate analytics init on Analytics=true.
export default function CookieConsent() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="alc-cookie-consent">
      <p>
        This site uses cookies. Choose your preferences below. See our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      <div className="alc-cookie-consent__actions">
        {/* TODO: granular checkboxes for Necessary / Analytics / Marketing */}
        <button onClick={() => setVisible(false)}>Accept All</button>
        <button onClick={() => setVisible(false)}>Necessary Only</button>
      </div>
    </div>
  );
}
