import api from "./api.js";
// GET /careers, GET /careers/{jobSlug} — Section 9.8
export const getRequisitions = () => api.get("/careers");
export const getRequisitionBySlug = (slug) => api.get(`/careers/${slug}`);
