import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ContentList from "./pages/ContentList.jsx";
import ContentEdit from "./pages/ContentEdit.jsx";
import "./styles/admin.css";

// Self-contained admin section: its own layout, its own styles, its own
// auth — mounted at /admin/* alongside (not inside) the public site's
// MainLayout/AppRouter, so nothing here can affect the public routes.
export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="content/:moduleKey" element={<ContentList />} />
            <Route path="content/:moduleKey/new" element={<ContentEdit />} />
            <Route path="content/:moduleKey/edit" element={<ContentEdit />} />
            <Route path="content/:moduleKey/:id/edit" element={<ContentEdit />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
