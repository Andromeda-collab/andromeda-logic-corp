// Form Field Set — Text / Select / File upload / budget-phase selector. Section 7.8.
// Used by Mission Consultation form (9.13) and gated-download forms (9.10).
export default function FormFieldSet({ label, type = "text", ...props }) {
  return (
    <label className="alc-form-field">
      <span>{label}</span>
      <input type={type} {...props} />
    </label>
  );
}
