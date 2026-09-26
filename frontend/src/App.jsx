import { Routes, Route } from "react-router-dom";
import AppRouter from "./router/AppRouter.jsx";
import AdminApp from "./admin/AdminApp.jsx";

// The admin CMS is mounted separately at /admin/* with its own layout,
// styles, and auth — it never touches the public site's routes below.
export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<AppRouter />} />
    </Routes>
  );
}
