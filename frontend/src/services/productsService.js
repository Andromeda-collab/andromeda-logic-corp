import api from "./api.js";
// GET /products, GET /products/{platformSlug} — Section 9.3
export const getPlatforms = () => api.get("/products");
export const getPlatformBySlug = (slug) => api.get(`/products/${slug}`);
