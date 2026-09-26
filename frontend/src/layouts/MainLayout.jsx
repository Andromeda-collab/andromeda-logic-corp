import { Outlet } from "react-router-dom";
import Header from "../components/common/Header.jsx";
import Footer from "../components/common/Footer.jsx";
import CookieConsent from "../components/common/CookieConsent.jsx";
import NovaLauncher from "../components/nova/NovaLauncher.jsx";

// Global modules per Section 8 — render on every page, built once as shared components.
export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <NovaLauncher />
    </>
  );
}
