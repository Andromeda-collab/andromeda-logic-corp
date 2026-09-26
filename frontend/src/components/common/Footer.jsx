import { Link } from "react-router-dom";
import logoFull from "../../assets/images/logo-full.png";

// Global footer — Section 8.2, column structure per Annexure A.2.
export default function Footer() {
  return (
    <footer className="alc-footer">
      <div className="alc-container alc-footer__brand">
        <img src={logoFull} alt="Andromeda Logic Corp" className="alc-footer__logo" />
      </div>

      <div className="alc-container alc-footer__grid">
        <div>
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/technology">Technology</Link>
          <Link to="/products">Products & Platforms</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/research">Research & Innovation</Link>
        </div>
        <div>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/newsroom">Newsroom</Link>
          <Link to="/investors">Investors & Partners</Link>
        </div>
        <div>
          <h3>Resources</h3>
          <Link to="/library">Technical Library</Link>
          <Link to="/missions">Case Studies & Mission Stories</Link>
          <Link to="/trust">Trust, Compliance & Export Control</Link>
        </div>
        <div>
          <h3>Get in Touch</h3>
          <Link to="/contact">Mission Consultation</Link>
        </div>
        <div>
          <h3>Legal</h3>
        </div>
      </div>
      <div className="alc-container alc-footer__bottom">
        <span>&copy; {new Date().getFullYear()} Andromeda Logic Corp Private Limited</span>
      </div>
    </footer>
  );
}