import axios from "axios";

// Admin API client — same backend as the public site's services/api.js, but
// attaches the JWT issued by POST /auth/login and redirects to /admin/login
// on a 401 instead of leaking protected data.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Origin without the /api/v1 suffix — used to resolve the relative
// image_url values ("/uploads/xyz.jpg") the backend returns into absolute
// URLs the browser can actually load.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("alc_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("alc_admin_token");
      localStorage.removeItem("alc_admin_user");
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
