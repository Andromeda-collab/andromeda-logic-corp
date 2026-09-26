import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.detail || "Sign in failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="alc-admin-login">
      <form className="alc-admin-login__card" onSubmit={handleSubmit}>
        <div className="alc-admin-login__brand">
          <span className="alc-admin-sidebar__brand-mark">AL</span>
          <span>Andromeda CMS</span>
        </div>
        <h1>Admin Sign In</h1>
        <p className="alc-admin-login__subtitle">Manage the Andromeda Logic Corp website.</p>

        {error && <div className="alc-admin-form__error">{error}</div>}

        <label>
          Email
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <button type="submit" className="alc-admin-btn alc-admin-btn--primary alc-admin-btn--block" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
