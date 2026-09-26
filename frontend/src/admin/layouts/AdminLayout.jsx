import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Entirely separate chrome from the public site's MainLayout — no shared
// Header/Footer/styles, so the public frontend is untouched by anything here.
export default function AdminLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="alc-admin-shell">
      <Sidebar />
      <div className="alc-admin-main">
        <Header />
        <main className="alc-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
