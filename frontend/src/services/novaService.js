import api from "./api.js";
// POST /nova/chat — NOVA AI Mission Assistant, Section 10.5 (RAG-backed)
export const sendNovaMessage = (message, sessionId) =>
  api.post("/nova/chat", { message, session_id: sessionId });
