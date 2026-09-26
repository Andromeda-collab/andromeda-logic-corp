import api from "./api.js";
// GET /library (filterable), GET /library/{resourceSlug} (gated) — Section 9.10
export const getLibraryResources = (params) => api.get("/library", { params });
export const requestGatedDownload = (slug, payload) =>
  api.post(`/library/${slug}/request-access`, payload);
