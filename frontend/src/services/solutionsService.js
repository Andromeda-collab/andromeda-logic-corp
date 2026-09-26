import api from "./api.js";
// GET /solutions, GET /solutions/{personaSlug} — Section 9.4
export const getPersonas = () => api.get("/solutions");
export const getPersonaBySlug = (slug) => api.get(`/solutions/${slug}`);
