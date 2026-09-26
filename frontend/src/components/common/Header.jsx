import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/images/logo-icon.png";
import { getNavItems } from "../../services/navigationService.js";

// Sticky header, mega-menu nav — Section 8.1 / navigation principles Section 6.2.
// Nav labels/links + the CTA button are admin-managed content (nav_items
// table) rather than hardcoded, so Admin Portal edits show up here directly.
export default function Header() {
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    getNavItems()
      .then((res) => setNavItems(res.data))
      .catch(() => {
        // Keep the header usable (logo only) even if the backend is down —
        // other pages already surface the "backend unreachable" error.
        setNavItems([]);
      });
  }, []);

  const links = navItems.filter((item) => !item.is_cta);
  const cta = navItems.find((item) => item.is_cta);

  return (
    <header className="alc-header">
      <div className="alc-container alc-header__inner">
        <Link to="/" className="alc-header__logo">
          <img src={logoIcon} alt="Andromeda Logic Corp" className="alc-header__logo-icon" />
          <span>Andromeda Logic Corp</span>
        </Link>

        {/* TODO: build out full mega-menu panels per Annexure A.1 */}
        <nav className="alc-header__nav">
          {links.map((item) => (
            <Link to={item.url} key={item.id}>{item.label}</Link>
          ))}
        </nav>

        {cta && (
          <Link to={cta.url} className="alc-button alc-button--primary">
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}