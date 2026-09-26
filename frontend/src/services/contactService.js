import api from "./api.js";
// POST /contact — Mission Consultation form submission, Section 9.13
export const submitMissionConsultation = (payload) => api.post("/contact", payload);
