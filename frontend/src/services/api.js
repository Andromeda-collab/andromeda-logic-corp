import axios from "axios";

// Base API client — talks to FastAPI backend (Section 11.5 API & Data Layer).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

export default api;
