import api from "./api.js";
// GET /home — Section 9.1 admin-managed hero content.
export const getHomeContent = () => api.get("/home");
