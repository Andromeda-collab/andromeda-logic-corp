import api from "./api.js";
// GET /navigation — header nav links + CTA button, Section 8.1.
export const getNavItems = () => api.get("/navigation");
