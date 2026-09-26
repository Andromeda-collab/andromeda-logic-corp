import api from "./api.js";
// GET /missions, GET /missions/{missionSlug} — Section 9.6
export const getMissions = () => api.get("/missions");
export const getMissionBySlug = (slug) => api.get(`/missions/${slug}`);
