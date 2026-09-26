import { useState } from "react";
import Button from "../../components/ui/Button.jsx";
import { submitMissionConsultation } from "../../services/contactService.js";

const PERSONAS = [
  { value: "space-agencies", label: "Space Agency" },
  { value: "commercial", label: "Commercial Space Operator" },
  { value: "defense", label: "Defense & National Security" },
  { value: "research", label: "Research Institution / Academia" },
];

const MISSION_PHASES = ["Concept", "Formulation", "Development", "Operations"];

const INITIAL_FORM = {
  persona: "",
  mission_phase: "",
  target_orbit_or_destination: "",
  timeframe: "",
  name: "",
  organization: "",
  role: "",
  email: "",
  country: "",
  consent_given: false,
};

// Mission Consultation Form — Section 9.13. Primary structured lead-capture surface.
export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.consent_given) {
      setErrorMessage("Please accept the data handling notice to continue.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // TODO: once file upload is wired on the backend, switch this to FormData
      // and include `file`. For now the RFP/spec document field is captured
      // client-side but not yet sent (backend endpoint accepts JSON only).
      await submitMissionConsultation(form);
      setStatus("success");
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err?.response?.data?.detail || "Something went wrong submitting your request. Please try again."
      );
    }
  };

  if (status === "success") {
    return (
      <section className="alc-container alc-section alc-contact-success">
        <h1>Request Received</h1>
        <p>
          Thank you for reaching out. A member of our mission engineering team will
          follow up with you shortly.
        </p>
        <Button variant="secondary" onClick={() => setStatus("idle")}>
          Submit another request
        </Button>
      </section>
    );
  }

  return (
    <section className="alc-container alc-section">
      <h1>Request Mission Consultation</h1>
      <p className="alc-contact-intro">
        Tell us about your mission and we'll route your request to the right team.
      </p>

      <form className="alc-form" onSubmit={handleSubmit}>
        {/* Persona Selector */}
        <fieldset className="alc-form__fieldset">
          <legend>Which best describes you?</legend>
          <div className="alc-form__radio-group">
            {PERSONAS.map((p) => (
              <label key={p.value} className="alc-form__radio">
                <input
                  type="radio"
                  name="persona"
                  value={p.value}
                  checked={form.persona === p.value}
                  onChange={handleChange}
                  required
                />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Mission Phase & Target Orbit/Timeframe */}
        <div className="alc-form__row">
          <label className="alc-form-field">
            <span>Mission Phase</span>
            <select name="mission_phase" value={form.mission_phase} onChange={handleChange}>
              <option value="">Select a phase</option>
              {MISSION_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {phase}
                </option>
              ))}
            </select>
          </label>

          <label className="alc-form-field">
            <span>Target Orbit / Destination</span>
            <input
              type="text"
              name="target_orbit_or_destination"
              placeholder="e.g. LEO, Lunar, Mars"
              value={form.target_orbit_or_destination}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="alc-form-field">
          <span>Timeframe</span>
          <input
            type="text"
            name="timeframe"
            placeholder="e.g. Q3 2027"
            value={form.timeframe}
            onChange={handleChange}
          />
        </label>

        {/* RFP / Spec Document Upload */}
        <label className="alc-form-field">
          <span>RFP or Technical Requirement Document (optional)</span>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>

        {/* Standard Contact Fields */}
        <div className="alc-form__row">
          <label className="alc-form-field">
            <span>Full Name</span>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="alc-form-field">
            <span>Organization</span>
            <input
              type="text"
              name="organization"
              value={form.organization}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="alc-form__row">
          <label className="alc-form-field">
            <span>Role / Title</span>
            <input type="text" name="role" value={form.role} onChange={handleChange} />
          </label>
          <label className="alc-form-field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
        </div>

        <label className="alc-form-field">
          <span>Country</span>
          <input type="text" name="country" value={form.country} onChange={handleChange} required />
        </label>

        {/* Consent & Data Handling Notice */}
        <label className="alc-form__checkbox">
          <input
            type="checkbox"
            name="consent_given"
            checked={form.consent_given}
            onChange={handleChange}
          />
          <span>
            I agree to the <a href="/privacy">Privacy Policy</a> and understand that
            technical assets requested through this form may be subject to export
            control review.
          </span>
        </label>

        {errorMessage && <p className="alc-form__error">{errorMessage}</p>}

        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </section>
  );
}