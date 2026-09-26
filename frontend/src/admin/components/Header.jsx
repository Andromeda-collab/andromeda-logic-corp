import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <header className="alc-admin-header">
      <div>
        <a href="/" target="_blank" rel="noreferrer" className="alc-admin-header__site-link">
          View Public Site ↗
        </a>
      </div>
      <div className="alc-admin-header__account">
        <span className="alc-admin-header__email">{admin?.email}</span>
        <button type="button" className="alc-admin-btn alc-admin-btn--ghost" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
