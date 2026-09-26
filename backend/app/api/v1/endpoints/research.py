from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.research import get_research_content, upsert_research_content, create_access_request
from app.schemas.research import ResearchContentOut, ResearchContentBase, AccessRequestOut, AccessRequestCreate
from app.core.security import get_current_admin

router = APIRouter(prefix="/research", tags=["Research & Innovation"])


@router.get("/", response_model=ResearchContentOut)
def get_research_overview(db: Session = Depends(get_db)):
    content = get_research_content(db)
    if not content:
        raise HTTPException(status_code=404, detail="Research content not set up yet")
    return content


@router.put("/", response_model=ResearchContentOut)
def set_research_overview(payload: ResearchContentBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return upsert_research_content(db, payload)


# Stays public — this is the visitor-facing access-request form, not a CMS write.
@router.post("/access-request", response_model=AccessRequestOut, status_code=201)
def submit_access_request(payload: AccessRequestCreate, db: Session = Depends(get_db)):
    return create_access_request(db, payload)