import api from "./api.js";
// GET /newsroom — Section 9.7
export const getPressItems = () => api.get("/newsroom");
