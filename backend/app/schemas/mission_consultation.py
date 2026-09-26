from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class MissionConsultationCreate(BaseModel):
    persona: str
    mission_phase: str | None = None
    target_orbit_or_destination: str | None = None
    timeframe: str | None = None
    name: str
    organization: str
    role: str | None = None
    email: EmailStr
    country: str
    rfp_document_url: str | None = None
    consent_given: bool


class MissionConsultationOut(MissionConsultationCreate):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)