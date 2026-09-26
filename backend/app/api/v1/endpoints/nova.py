from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.services.nova_service import generate_response, generate_response_stream
from app.models.nova_conversation import NovaConversationLog
import json


class NovaChatRequest(BaseModel):
    message: str
    session_id: str


router = APIRouter(prefix="/nova", tags=["NOVA AI Mission Assistant"])


# POST /api/v1/nova/chat — Section 10.5 Technical Architecture.
@router.post("/chat")
def nova_chat(payload: NovaChatRequest, db: Session = Depends(get_db)):
    result = generate_response(db, payload.message)

    # Log both turns — Section 10.6 Data Governance.
    db.add(NovaConversationLog(
        session_id=payload.session_id,
        role="user",
        message=payload.message,
    ))
    db.add(NovaConversationLog(
        session_id=payload.session_id,
        role="assistant",
        message=result["reply"],
        cited_sources=json.dumps(result["citations"]),
    ))
    db.commit()

    return result


# POST /api/v1/nova/chat/stream — same grounding/logging behavior as above,
# but streams reply text as it's generated instead of waiting for the full
# ~5-9s completion, so the panel can render it progressively. Preferred by
# the frontend; /chat is kept for non-streaming callers.
@router.post("/chat/stream")
def nova_chat_stream(payload: NovaChatRequest):
    return StreamingResponse(
        generate_response_stream(payload.session_id, payload.message),
        media_type="text/plain",
    )