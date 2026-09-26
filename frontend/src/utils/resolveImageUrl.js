// Resolves a relative image_url ("/uploads/xyz.jpg") returned by the API
// into an absolute URL pointing at the backend, so it loads correctly
// regardless of which origin the frontend itself is served from.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1").replace(/\/api\/v1\/?$/, "");

export default function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}
