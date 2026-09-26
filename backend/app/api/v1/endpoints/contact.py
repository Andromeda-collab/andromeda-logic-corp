from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.crud.mission_consultation import (
    create_mission_consultation, get_all_mission_consultations, get_mission_consultation,
)
from app.schemas.mission_consultation import MissionConsultationCreate, MissionConsultationOut
from app.core.security import get_current_admin

router = APIRouter(prefix="/contact", tags=["Mission Consultation"])


# POST /api/v1/contact — Section 9.13 primary lead-capture form. Public, unauthenticated.
# TODO: route to sales/BD queue by persona+mission_phase (post-submit routing
# logic per 9.13), trigger auto-acknowledgment email, run export-control
# country screening (14.1) when country indicates a controlled destination.
@router.post("/", response_model=MissionConsultationOut, status_code=201)
def submit_mission_consultation(
    payload: MissionConsultationCreate, db: Session = Depends(get_db)
):
    return create_mission_consultation(db, payload)


# GET /api/v1/contact — admin-only list of submissions (Admin CMS: Mission Consultations).
@router.get("/", response_model=list[MissionConsultationOut])
def list_mission_consultations(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return get_all_mission_consultations(db)


# GET /api/v1/contact/{id} — admin-only single submission, for the CMS detail view.
@router.get("/{consultation_id}", response_model=MissionConsultationOut)
def get_mission_consultation_detail(
    consultation_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)
):
    consultation = get_mission_consultation(db, consultation_id)
    if not consultation:
        raise HTTPException(status_code=404, detail="Mission consultation not found")
    return consultation