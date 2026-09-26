import api from "./api.js";
// GET /technology, GET /technology/{specialtySlug} — Section 9.2
export const getSpecialties = () => api.get("/technology");
export const getSpecialtyBySlug = (slug) => api.get(`/technology/${slug}`);
