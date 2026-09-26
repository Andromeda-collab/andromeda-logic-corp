"""
NOVA AI Mission Assistant — service layer.
Section 10.5: RAG-grounded over Technology, Products, and Case Studies
content only. Every factual answer cites its source. Out-of-scope questions
get a graceful handoff rather than a speculative answer (10.5 Fallback Behavior).
"""

import json
import time

import google.generativeai as genai
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.specialty import Specialty
from app.models.platform import Platform
from app.models.mission import Mission
from app.models.nova_conversation import NovaConversationLog

genai.configure(api_key=settings.GEMINI_API_KEY)

SYSTEM_INSTRUCTION = """You are NOVA, the AI Mission Assistant for Andromeda Logic Corp,
a space technology company building autonomous, radiation-tolerant computing systems
for deep-space missions.

Rules you must follow:
1. Only answer using the CONTEXT provided below. Never invent facts about
   Andromeda Logic Corp's specialties, products, or missions.
2. If the answer isn't in the CONTEXT, say you don't have that information
   and suggest the visitor use the Mission Consultation form instead.
3. When you use information from the CONTEXT, mention which item it came
   from (e.g. "According to our GNC Autonomy Stack page...").
4. Keep answers concise and professional — 2-4 sentences unless more detail
   is clearly needed.
5. Never discuss pricing, legal/export-control specifics, or make
   commitments on the company's behalf — direct those questions to the
   Mission Consultation form.
"""

# NOTE on max_output_tokens: this model appears to consume part of its
# output budget on internal reasoning before emitting the visible reply, so
# a tight cap doesn't just shorten answers — it can cut generation off
# mid-thought (finish_reason=MAX_TOKENS) and triggers a severe latency
# penalty (observed ~42s on a 260-token cap vs. ~3.8s at 1024, measured via
# the same grounded prompt/system-instruction the real endpoint sends).
# 1024 was the fastest setting that still completed cleanly (finish_reason
# STOP) across repeated tests — don't lower this without re-measuring
# finish_reason, not just answer length.
GENERATION_CONFIG = genai.types.GenerationConfig(
    max_output_tokens=1024,
    temperature=0.4,
)

# Context rarely changes turn-to-turn (it's driven by admin-managed content,
# not the conversation), so re-querying and re-serializing it on every
# single chat message is wasted latency. Cached briefly and invalidated
# whenever admin content write endpoints touch these tables.
_context_cache: dict[str, str | float] = {"text": "", "built_at": 0.0}
_CONTEXT_TTL_SECONDS = 60


def invalidate_context_cache() -> None:
    _context_cache["built_at"] = 0.0


def build_context(db: Session) -> str:
    """
    Retrieval step (Section 10.5 Grounding/RAG). Pulls all specialties,
    platforms, and reference-rights-approved missions as the grounding
    context. Simple "retrieve everything" approach for now — fine at this
    content scale; swap for real vector search if the catalog grows large.
    """
    now = time.monotonic()
    if now - _context_cache["built_at"] < _CONTEXT_TTL_SECONDS and _context_cache["text"]:
        return _context_cache["text"]

    specialties = db.query(Specialty).all()
    platforms = db.query(Platform).all()
    missions = db.query(Mission).filter(Mission.reference_rights_approved == True).all()  # noqa: E712

    parts = []

    if specialties:
        parts.append("=== CORE SPECIALTIES ===")
        for s in specialties:
            parts.append(f"- {s.name} (source: /technology/{s.slug}): {s.short_description}")

    if platforms:
        parts.append("\n=== PRODUCTS & PLATFORMS ===")
        for p in platforms:
            parts.append(f"- {p.name} (source: /products/{p.slug}, status: {p.status.value}): {p.one_line_pitch}")

    if missions:
        parts.append("\n=== MISSION STORIES ===")
        for m in missions:
            parts.append(f"- {m.title} (source: /missions/{m.slug}): {m.summary}")

    text = "\n".join(parts) if parts else "No content has been published yet."
    _context_cache["text"] = text
    _context_cache["built_at"] = now
    return text


def extract_citations(context: str, reply_text: str) -> list[dict]:
    """Simple citation extraction: check which known source paths were
    mentioned in the reply (Section 10.7 Cited Answer state)."""
    citations = []
    for line in context.split("\n"):
        if "(source:" in line and "/" in line:
            src = line.split("(source:")[1].split(",")[0].split(")")[0].strip()
            name = line.split("- ")[1].split(" (source:")[0] if "- " in line else None
            if src and (src in reply_text or (name and name.lower() in reply_text.lower())):
                citations.append({"source": src, "title": name})
    return citations[:3]  # cap at 3 citations


def _log_turns(db: Session, session_id: str, user_message: str, reply: str, citations: list[dict]) -> None:
    db.add(NovaConversationLog(session_id=session_id, role="user", message=user_message))
    db.add(NovaConversationLog(
        session_id=session_id, role="assistant", message=reply, cited_sources=json.dumps(citations),
    ))
    db.commit()


def generate_response(db: Session, message: str) -> dict:
    """
    Non-streaming path (kept for API compatibility / non-browser callers).
    Sends the grounded context + user question to Gemini, returns
    {"reply": str, "citations": list[dict]}.
    """
    if not settings.GEMINI_API_KEY:
        return {
            "reply": "NOVA isn't configured yet — no API key has been set.",
            "citations": [],
        }

    context = build_context(db)
    model = genai.GenerativeModel(
        model_name=settings.GEMINI_MODEL,
        system_instruction=SYSTEM_INSTRUCTION,
        generation_config=GENERATION_CONFIG,
    )
    prompt = f"CONTEXT:\n{context}\n\nVISITOR QUESTION: {message}"

    try:
        response = model.generate_content(prompt)
        reply_text = response.text
    except Exception as e:
        return {
            "reply": f"NOVA hit an error reaching the AI service: {str(e)}",
            "citations": [],
        }

    return {"reply": reply_text, "citations": extract_citations(context, reply_text)}


def generate_response_stream(session_id: str, message: str):
    """
    Streaming path — yields reply text chunks as Gemini produces them, so
    the UI can render the answer progressively instead of blocking on the
    full ~5-9s completion. Emits a trailing '\\n\\n<<CITATIONS>>{json}'
    marker once the reply is complete, then logs both conversation turns.

    Opens its own DB session (rather than taking one via Depends) because
    this generator keeps running after the endpoint function returns the
    StreamingResponse, by which point a request-scoped session would
    already have been closed.
    """
    db = SessionLocal()
    try:
        context = build_context(db)

        if not settings.GEMINI_API_KEY:
            reply = "NOVA isn't configured yet — no API key has been set."
            yield reply
            _log_turns(db, session_id, message, reply, [])
            yield f"\n\n<<CITATIONS>>{json.dumps([])}"
            return

        model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=SYSTEM_INSTRUCTION,
            generation_config=GENERATION_CONFIG,
        )
        prompt = f"CONTEXT:\n{context}\n\nVISITOR QUESTION: {message}"

        full_text = ""
        try:
            for chunk in model.generate_content(prompt, stream=True):
                if chunk.text:
                    full_text += chunk.text
                    yield chunk.text
        except Exception as e:
            full_text = f"NOVA hit an error reaching the AI service: {str(e)}"
            yield full_text

        citations = extract_citations(context, full_text)
        _log_turns(db, session_id, message, full_text, citations)
        yield f"\n\n<<CITATIONS>>{json.dumps(citations)}"
    finally:
        db.close()
