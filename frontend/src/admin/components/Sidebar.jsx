import { NavLink } from "react-router-dom";
import { MODULE_LIST } from "../config/contentModules.js";

export default function Sidebar() {
  return (
    <aside className="alc-admin-sidebar">
      <div className="alc-admin-sidebar__brand">
        <span className="alc-admin-sidebar__brand-mark">AL</span>
        <span>Andromeda CMS</span>
      </div>

      <nav className="alc-admin-sidebar__nav">
        <NavLink to="/admin" end className={({ isActive }) => `alc-admin-nav-link ${isActive ? "alc-admin-nav-link--active" : ""}`}>
          Dashboard
        </NavLink>

        <div className="alc-admin-sidebar__section-label">Content</div>
        {MODULE_LIST.map((m) => (
          <NavLink
            key={m.key}
            to={`/admin/content/${m.key}`}
            className={({ isActive }) => `alc-admin-nav-link ${isActive ? "alc-admin-nav-link--active" : ""}`}
          >
            {m.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
